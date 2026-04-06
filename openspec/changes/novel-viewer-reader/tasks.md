## 1. Dependencies & Configuration

- [ ] 1.1 Install `marked` for server-side markdown rendering: `npm install marked`
- [ ] 1.2 Update `globals.css` — add `@theme` block with all color primitives, semantic aliases, and `.dark` overrides per `design-system` spec

## 2. R2 Data Access Library (`src/lib/r2/index.ts`)

- [ ] 2.1 Create `src/lib/r2/index.ts` — define `NovelMeta`, `NovelSummary`, `Novel`, `ChapterData` TypeScript types
- [ ] 2.2 Implement `getNovelList()` — list `novels/` prefix, batch-fetch each `meta.json` with `p-queue` (concurrency 10), return `NovelSummary[]`; omit novels with unparseable meta
- [ ] 2.3 Implement `getNovel(slug)` — fetch `novels/{slug}/meta.json`, list `novels/{slug}/chapters/`, list `novels/{slug}/assets/`, return full `Novel` object or `null`
- [ ] 2.4 Implement `getCoverArt(slug)` — list `novels/{slug}/assets/`, return first key matching `cover_art.*` or `null`
- [ ] 2.5 Implement `getNovelChapterData(slug, chapterNumber)` — fetch `novels/{slug}/chapters/{chapterNumber}.md`, parse optional frontmatter `title`, render body with `marked`, derive `prev`/`next` from chapter listing; return `ChapterData` or `null`
- [ ] 2.6 Create `src/lib/r2/_readme.md` documenting purpose and usage of each exported function

## 3. R2 Image Proxy Endpoint

- [ ] 3.1 Create `src/pages/api/r2/[...path].ts` — `GET` handler that reads the R2 object at the requested path, returns the stream with correct `Content-Type`, and returns `404` if not found

## 4. Global Atomic Components (`src/components/`)

- [ ] 4.1 Create `StatusBadge.astro` — accepts `status: "ongoing" | "completed" | "hiatus"`, renders a colored pill using design token colors (global: reusable for any status indicator)
- [ ] 4.2 Create `GenreTag.astro` — accepts `genre: string`, renders a secondary-colored rounded pill (global: reusable for any tag/badge UI)
- [ ] 4.3 Create `EmptyState.astro` — accepts `heading` and `description` props, renders a centered book icon + heading + description (global: reusable for any empty state)
- [ ] 4.4 Create `NovelCard.astro` — accepts `NovelSummary` + `href`, renders cover art (`/api/r2/{key}` or placeholder), title, author, `StatusBadge`; entire card is a link (global: card pattern reusable for listings)

## 5. Feature-Specific Components (`src/features/novel-viewer/components/`)

- [ ] 5.1 Create `ChapterNav.astro` — accepts `slug`, `prev: string | null`, `next: string | null`; renders prev/next buttons; disables (visually muted, no href) when null (feature-specific: tightly coupled to novel chapter navigation)

## 6. Feature Composition Components (`src/features/novel-viewer/`)

- [ ] 6.1 Create `NovelGrid.astro` — accepts `novels: NovelSummary[]`, renders a responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`) of `NovelCard` components, or `EmptyState` if empty
- [ ] 6.2 Create `NovelDetailHeader.astro` — accepts `Novel`, renders cover art, title, author, description, `StatusBadge`, language, dates, and a flex-wrap row of `GenreTag` per genre; responsive stacked/side-by-side layout
- [ ] 6.3 Create `ChapterList.astro` — accepts `chapters` array and `slug`, renders scrollable numbered list of chapter items linking to `/novels/{slug}/chapters/{number}`; shows "No chapters yet" when empty
- [ ] 6.4 Create `ChapterReader.astro` — accepts `ChapterData` + `slug`, renders chapter heading, `ChapterNav` (top), prose HTML content in a `max-w-3xl` centered container, `ChapterNav` (bottom)

## 7. Pages

- [ ] 7.1 Create `src/pages/novels/index.astro` — fetch `getNovelList()`, pass to `NovelGrid`, set SEO title/description in `Layout`
- [ ] 7.2 Create `src/pages/novels/[slug]/index.astro` — fetch `getNovel(slug)`, return 404 if null, render `NovelDetailHeader` + `ChapterList`, set SEO title/description/OG tags in `Layout`
- [ ] 7.3 Create `src/pages/novels/[slug]/chapters/[chapter].astro` — fetch `getNovelChapterData(slug, chapter)`, return 404 if null, render `ChapterReader`, set SEO title (chapter + novel title)
- [ ] 7.4 Update `src/pages/index.astro` — add a simple landing/home page that links to `/novels`

## 8. Layout Updates

- [ ] 8.1 Update `src/layouts/Layout.astro` — accept optional `description`, `ogTitle`, `ogDescription`, `ogImage` props and render the appropriate `<meta>` tags in `<head>`

## 9. Validation & Polish

- [ ] 9.1 Verify empty state renders correctly when R2 bucket has no novels
- [ ] 9.2 Verify dark mode toggles correctly on all three pages using `ThemeScript.astro`
- [ ] 9.3 Verify responsive layout on mobile (375px), tablet (768px), and desktop (1280px) viewports
- [ ] 9.4 Verify chapter prev/next navigation links work end-to-end
- [ ] 9.5 Verify `/api/r2/[...path]` returns 404 for nonexistent keys and correct bytes for existing objects
