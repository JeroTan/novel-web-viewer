## 1. Dependencies & Configuration

- [x] 1.1 Install `marked` for server-side markdown rendering: `npm install marked`
- [x] 1.2 Update `globals.css` — add `@theme` block with all color primitives, semantic aliases, and `.dark` overrides per `design-system` spec

## 2. R2 Data Access Library (`src/lib/r2/index.ts`)

- [x] 2.1 Create `src/lib/r2/index.ts` — define `NovelMeta`, `NovelSummary`, `Novel`, `ChapterData` TypeScript types
- [x] 2.2 Implement `getNovelList()` — list `novels/` prefix, batch-fetch each `meta.json` with `p-queue` (concurrency 10), return `NovelSummary[]`; omit novels with unparseable meta
- [x] 2.3 Implement `getNovel(slug)` — fetch `novels/{slug}/meta.json`, list `novels/{slug}/chapters/`, list `novels/{slug}/assets/`, return full `Novel` object or `null`
- [x] 2.4 Implement `getCoverArt(slug)` — list `novels/{slug}/assets/`, return first key matching `cover_art.*` or `null`
- [x] 2.5 Implement `getNovelChapterData(slug, chapterNumber)` — fetch `novels/{slug}/chapters/{chapterNumber}.md`, parse optional frontmatter `title`, render body with `marked`, derive `prev`/`next` from chapter listing; return `ChapterData` or `null`
- [x] 2.6 Create `src/lib/r2/_readme.md` documenting purpose and usage of each exported function

## 3. R2 Image Proxy Endpoint

- [x] 3.1 Create `src/pages/api/r2/[...path].ts` — `GET` handler that reads the R2 object at the requested path, returns the stream with correct `Content-Type`, and returns `404` if not found

## 4. Global Atomic Components (`src/components/`)

- [x] 4.1 Create `StatusBadge.astro` — accepts `status: "ongoing" | "completed" | "hiatus"`, renders a colored pill using design token colors (global: reusable for any status indicator)
- [x] 4.2 Create `GenreTag.astro` — accepts `genre: string`, renders a secondary-colored rounded pill (global: reusable for any tag/badge UI)
- [x] 4.3 Create `EmptyState.astro` — accepts `heading` and `description` props, renders a centered book icon + heading + description (global: reusable for any empty state)
- [x] 4.4 Create `NovelCard.astro` — accepts `NovelSummary` + `href`, renders cover art (`/api/r2/{key}` or placeholder), title, author, `StatusBadge`; entire card is a link (global: card pattern reusable for listings)

## 5. Feature-Specific Components (`src/features/novel-viewer/components/`)

- [x] 5.1 Create `ChapterNav.astro` — accepts `slug`, `prev: string | null`, `next: string | null`; renders prev/next buttons; disables (visually muted, no href) when null (feature-specific: tightly coupled to novel chapter navigation)

## 6. Feature Composition Components (`src/features/novel-viewer/`)

- [x] 6.1 Create `NovelGrid.astro` — accepts `novels: NovelSummary[]`, renders a responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`) of `NovelCard` components, or `EmptyState` if empty
- [x] 6.2 Create `NovelDetailHeader.astro` — accepts `Novel`, renders cover art, title, author, description, `StatusBadge`, language, dates, and a flex-wrap row of `GenreTag` per genre; responsive stacked/side-by-side layout
- [x] 6.3 Create `ChapterList.astro` — accepts `chapters` array and `slug`, renders scrollable numbered list of chapter items linking to `/novels/{slug}/chapters/{number}`; shows "No chapters yet" when empty
- [x] 6.4 Create `ChapterReader.astro` — accepts `ChapterData` + `slug`, renders chapter heading, `ChapterNav` (top), prose HTML content in a `max-w-3xl` centered container, `ChapterNav` (bottom)

## 7. Pages

- [x] 7.1 Create `src/pages/novels/index.astro` — fetch `getNovelList()`, pass to `NovelGrid`, set SEO title/description in `Layout`
- [x] 7.2 Create `src/pages/novels/[slug]/index.astro` — fetch `getNovel(slug)`, return 404 if null, render `NovelDetailHeader` + `ChapterList`, set SEO title/description/OG tags in `Layout`
- [x] 7.3 Create `src/pages/novels/[slug]/chapters/[chapter].astro` — fetch `getNovelChapterData(slug, chapter)`, return 404 if null, render `ChapterReader`, set SEO title (chapter + novel title)
- [x] 7.4 Update `src/pages/index.astro` — add a simple landing/home page that links to `/novels`

## 8. Layout Updates

- [x] 8.1 Update `src/layouts/Layout.astro` — accept optional `description`, `ogTitle`, `ogDescription`, `ogImage` props and render the appropriate `<meta>` tags in `<head>`

## 9. Validation & Polish

- [x] 9.1 Verify empty state renders correctly when R2 bucket has no novels
- [x] 9.2 Verify dark mode toggles correctly on all three pages using `ThemeScript.astro`
- [x] 9.3 Verify responsive layout on mobile (375px), tablet (768px), and desktop (1280px) viewports
- [x] 9.4 Verify chapter prev/next navigation links work end-to-end
- [x] 9.5 Verify `/api/r2/[...path]` returns 404 for nonexistent keys and correct bytes for existing objects

## 10. Copy & UX Polish

- [x] 10.1 Update `src/pages/index.astro` — replace all technical copy ("Cloudflare R2", etc.) with reader-friendly language in both the visible body text and the SEO `description` meta prop
- [x] 10.2 Audit all other user-visible strings across pages and components — remove any remaining references to infrastructure terms ("R2", "Cloudflare", "Workers", "bucket", "API") from text rendered to the user

## 11. Reader Prose Formatting

- [x] 11.1 Create `src/features/novel-viewer/components/ReaderFormatStyle.astro` — wraps `<slot />` in a `<div>` with a unique class; uses `<style is:global>` scoped to that class to apply explicit prose styles (`p`, `h1`–`h6`, `blockquote`, `hr`, `em`, `strong`, `ul`, `ol`, `li`, `a`, `code`, `pre`) with sufficient specificity to override Tailwind v4 Preflight resets
- [x] 11.2 Update `ChapterReader.astro` — replace the inline `.prose-chapter` `<style>` block and raw `<div set:html>` with `<ReaderFormatStyle>` wrapping the `set:html` div, remove the old scoped style block

## 12. Cover Art Lightbox

- [x] 12.1 Create `src/features/novel-viewer/components/CoverArtLightbox.astro` — accepts `src: string` and `alt: string` props; renders a hidden full-screen overlay (`id="cover-lightbox"`) with a centered `<img>`, close button (`✕`), zoom-in (`+`) and zoom-out (`-`) buttons; implemented with inline `<script>` for open/close, scroll-to-zoom (clamped 1×–5×), click-drag pan, and `Escape` key to close; backdrop click also closes
- [x] 12.2 Update `NovelDetailHeader.astro` — import and render `CoverArtLightbox` (only when `coverArtKey` is non-null); wrap the cover art `<img>` in a `<button>` that triggers the lightbox open on click; add a visual hint (cursor pointer, subtle hover effect) indicating the image is interactive
