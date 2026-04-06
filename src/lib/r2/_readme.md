# R2 Data Access Library

This module provides all Cloudflare R2 data-access functions for the novel viewer.

## Exports

### Types

- **`NovelMeta`** — Raw `meta.json` fields (title, author, description, status, genre, tags, language, publishedAt, updatedAt)
- **`NovelSummary`** — `NovelMeta` + `slug` + `coverArtKey` (used in list views)
- **`Novel`** — `NovelSummary` + `chapters[]` array (used on detail/reader pages)
- **`ChapterData`** — Rendered HTML, title, chapterNumber, prev/next navigation

### Functions

- **`getNovelList()`** — Lists all novels under `novels/` prefix, batch-fetches meta.json with concurrency 10 via `p-queue`. Omits novels with unparseable meta.
- **`getNovel(slug)`** — Fetches `novels/{slug}/meta.json` + chapter list + cover art key. Returns `null` if not found.
- **`getCoverArt(slug)`** — Returns the R2 key for `novels/{slug}/assets/cover_art.*`, or `null`.
- **`getNovelChapterData(slug, chapterNumber)`** — Fetches chapter markdown, parses frontmatter `title`, renders body via `marked`, returns `ChapterData` with prev/next. Returns `null` if not found.
- **`getR2Object(key)`** — Low-level: returns `{ body: ReadableStream, contentType: string }` for the R2 proxy endpoint. Returns `null` if not found.

## R2 Binding

All functions access R2 via `import { env } from 'cloudflare:workers'` using the `NOVEL_VIEWER_STORAGE` binding.

## Path Conventions

```
novels/{slug}/meta.json
novels/{slug}/chapters/00001.md
novels/{slug}/assets/cover_art.{jpg|png|webp}
```
