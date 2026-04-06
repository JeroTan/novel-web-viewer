## Why

The project has a fully configured Astro + Cloudflare Workers environment with an R2 bucket (`NOVEL_VIEWER_STORAGE`) but no user-facing application. We need to build the novel viewer — the core product — so readers can discover novels, browse chapters, and read content fetched live from R2.

## What Changes

- Add a centralized design token system (colors, typography, spacing) in `globals.css`
- Add a `src/lib/r2/` atomic library for all R2 data-access operations
- Add `src/features/novel-viewer/` feature components for the full reading experience
- Add three Astro pages: novel list (`/novels`), novel detail (`/novels/[slug]`), and chapter reader (`/novels/[slug]/chapters/[chapter]`)
- Define and document the `meta.json` schema for novel metadata stored in R2
- Add `marked` (or equivalent) for server-side markdown rendering of chapter content fetched from R2
- Add SEO metadata (title, description, Open Graph) per page

**Proposed `meta.json` structure** (awaiting approval):
```json
{
  "title": "The Wandering Immortal",
  "author": "Someone",
  "description": "A short blurb shown on the novel card and detail page.",
  "status": "ongoing",
  "genre": ["fantasy", "cultivation"],
  "tags": ["reincarnation", "magic-system"],
  "language": "en",
  "publishedAt": "2024-01-15",
  "updatedAt": "2024-12-01"
}
```

## Capabilities

### New Capabilities
- `r2-data-access`: Atomic R2 library (`lib/r2/`) — `getNovelList()`, `getNovel()`, `getCoverArt()`, `getNovelChapterData()`
- `novel-list-page`: Page + feature components to list all novels from R2 with cover art, title, author, status; empty state when R2 is empty
- `novel-detail-page`: Page + feature components showing novel metadata, genre tags, and a scrollable chapter list
- `novel-chapter-reader`: Page + feature components that fetch and render a chapter's markdown from R2 with prev/next navigation
- `design-system`: Centralized Tailwind v4 design tokens in `globals.css` (color primitives, semantic aliases, dark mode via `.dark` class)

### Modified Capabilities
- None

## Impact

- **New files**: `src/lib/r2/index.ts`, `src/features/novel-viewer/` (multiple components), `src/pages/novels/`, `src/pages/novels/[slug]/`, `src/pages/novels/[slug]/chapters/[chapter].astro`, `src/styles/globals.css` (extended)
- **New dependency**: markdown rendering library (e.g. `marked`) for parsing R2-fetched `.md` content
- **Bindings used**: `NOVEL_VIEWER_STORAGE` (R2) via `import { env } from 'cloudflare:workers'`
- **No breaking changes** — additive only
