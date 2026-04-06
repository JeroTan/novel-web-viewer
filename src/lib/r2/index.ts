import { env } from "cloudflare:workers";
import { marked } from "marked";
import PQueue from "p-queue";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NovelMeta {
  title: string;
  author: string;
  description: string;
  status: "ongoing" | "completed" | "hiatus";
  genre: string[];
  tags: string[];
  language: string;
  publishedAt: string;
  updatedAt: string;
}

export interface NovelSummary extends NovelMeta {
  slug: string;
  coverArtKey: string | null;
}

export interface Novel extends NovelSummary {
  chapters: { key: string; number: string; title?: string }[];
}

export interface ChapterData {
  html: string;
  title: string | null;
  chapterNumber: string;
  prev: string | null;
  next: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseFrontmatter(raw: string): { title: string | null; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { title: null, body: raw };
  const frontmatter = match[1] ?? "";
  const body = match[2] ?? "";
  const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
  const title = titleMatch ? titleMatch[1]!.trim().replace(/^["']|["']$/g, "") : null;
  return { title, body };
}

function extensionToContentType(key: string): string {
  const ext = key.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    case "md":
      return "text/markdown";
    default:
      return "application/octet-stream";
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * List all novels in R2, fetching each meta.json with concurrency 10.
 * Novels with unparseable meta are silently omitted.
 */
export async function getNovelList(): Promise<NovelSummary[]> {
  const bucket: R2Bucket = env.NOVEL_VIEWER_STORAGE;
  const listed = await bucket.list({ prefix: "novels/", delimiter: "/" });

  const slugs: string[] = (listed.delimitedPrefixes ?? [])
    .map((prefix) => prefix.replace(/^novels\//, "").replace(/\/$/, ""))
    .filter(Boolean);

  if (slugs.length === 0) return [];

  const queue = new PQueue({ concurrency: 10 });
  const results: NovelSummary[] = [];

  await queue.addAll(
    slugs.map((slug) => async () => {
      const obj = await bucket.get(`novels/${slug}/meta.json`);
      if (!obj) return;
      try {
        const text = await obj.text();
        const meta = JSON.parse(text) as NovelMeta;
        const coverArtKey = await getCoverArt(slug);
        results.push({ slug, coverArtKey, ...meta });
      } catch {
        console.warn(`[r2] Failed to parse meta.json for slug: ${slug}`);
      }
    })
  );

  return results;
}

/**
 * Fetch a single novel's full data including chapter list and cover art key.
 * Returns null if the novel does not exist.
 */
export async function getNovel(slug: string): Promise<Novel | null> {
  const bucket: R2Bucket = env.NOVEL_VIEWER_STORAGE;

  const metaObj = await bucket.get(`novels/${slug}/meta.json`);
  if (!metaObj) return null;

  let meta: NovelMeta;
  try {
    meta = JSON.parse(await metaObj.text()) as NovelMeta;
  } catch {
    return null;
  }

  const [chaptersListed, coverArtKey] = await Promise.all([
    bucket.list({ prefix: `novels/${slug}/chapters/` }),
    getCoverArt(slug),
  ]);

  const chapters = (chaptersListed.objects ?? [])
    .filter((obj) => obj.key.endsWith(".md"))
    .map((obj) => {
      const filename = obj.key.split("/").pop() ?? "";
      const number = filename.replace(/\.md$/, "");
      return { key: obj.key, number };
    })
    .sort((a, b) => a.number.localeCompare(b.number));

  return { slug, coverArtKey, ...meta, chapters };
}

/**
 * Return the R2 key for the cover art file, or null if none exists.
 */
export async function getCoverArt(slug: string): Promise<string | null> {
  const bucket: R2Bucket = env.NOVEL_VIEWER_STORAGE;
  const listed = await bucket.list({ prefix: `novels/${slug}/assets/` });
  const coverObj = (listed.objects ?? []).find((obj) =>
    /\/cover_art\.[a-z]+$/i.test(obj.key)
  );
  return coverObj?.key ?? null;
}

/**
 * Fetch a chapter's markdown from R2, render to HTML, and compute prev/next navigation.
 * Returns null if the chapter key does not exist.
 */
export async function getNovelChapterData(
  slug: string,
  chapterNumber: string
): Promise<ChapterData | null> {
  const bucket: R2Bucket = env.NOVEL_VIEWER_STORAGE;

  const [chapterObj, chaptersListed] = await Promise.all([
    bucket.get(`novels/${slug}/chapters/${chapterNumber}.md`),
    bucket.list({ prefix: `novels/${slug}/chapters/` }),
  ]);

  if (!chapterObj) return null;

  const raw = await chapterObj.text();
  const { title, body } = parseFrontmatter(raw);
  const html = await marked.parse(body);

  const chapterNumbers = (chaptersListed.objects ?? [])
    .filter((obj) => obj.key.endsWith(".md"))
    .map((obj) => obj.key.split("/").pop()!.replace(/\.md$/, ""))
    .sort((a, b) => a.localeCompare(b));

  const idx = chapterNumbers.indexOf(chapterNumber);
  const prev = idx > 0 ? chapterNumbers[idx - 1]! : null;
  const next = idx < chapterNumbers.length - 1 ? chapterNumbers[idx + 1]! : null;

  return { html, title, chapterNumber, prev, next };
}

/**
 * Fetch a raw R2 object by key and return its body + content-type.
 * Used by the API proxy endpoint.
 */
export async function getR2Object(
  key: string
): Promise<{ body: ReadableStream; contentType: string } | null> {
  const bucket: R2Bucket = env.NOVEL_VIEWER_STORAGE;
  const obj = await bucket.get(key);
  if (!obj) return null;
  return {
    body: obj.body,
    contentType: obj.httpMetadata?.contentType ?? extensionToContentType(key),
  };
}

export { extensionToContentType };
