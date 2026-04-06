## Context

The project is an Astro 6 + Cloudflare Workers SSR application. Novel content (markdown chapters, cover art, metadata) is stored in an R2 bucket (`NOVEL_VIEWER_STORAGE`) under a defined path convention: `novels/{slug}/meta.json`, `novels/{slug}/chapters/{chapter}.md`, and `novels/{slug}/assets/cover_art.*`. There is no database — R2 is the single source of truth. The Cloudflare adapter is already configured. Tailwind CSS v4 (CSS-first, no config file) is the styling system.

## Goals / Non-Goals

**Goals:**
- Build a full reading experience: novel list → novel detail → chapter reader
- Fetch all data live from R2 at request time (SSR — no static generation)
- Atomic R2 library in `src/lib/r2/` decoupled from presentation
- Centralized design tokens in `globals.css` with dark/light mode and responsive layout
- Empty state UI when R2 has no novels
- SEO metadata per page (title, description, Open Graph)

**Non-Goals:**
- User authentication or reading progress tracking
- Admin/upload interface
- Search or filters
- Comment system
- CDN caching strategy (can be added later)

## Decisions

### 1. R2 Access Pattern — `import { env } from 'cloudflare:workers'`

**Decision**: Use `import { env } from 'cloudflare:workers'` in all R2 library functions.

**Rationale**: Astro 6.0 on Cloudflare Workers exposes bindings via `cloudflare:workers`. The older `Astro.locals.runtime.env` pattern works in `.astro` files but not in plain `.ts` modules. Using the `cloudflare:workers` import makes the R2 library portable, testable, and decoupled from Astro's request context.

**Alternative considered**: Pass `env` as a parameter to each function — rejected because it requires every call site to pass the runtime context, adding boilerplate.

---

### 2. Markdown Rendering — `marked` library

**Decision**: Install `marked` and render chapter markdown to HTML on the server as part of the `getNovelChapterData()` response.

**Rationale**: Chapter `.md` files live in R2, not on disk. Astro's `render()` from `astro:content` only works with content collection entries parsed at build time. Since content is fetched at runtime from R2, we need a standalone markdown parser. `marked` is small (~2KB), has no native dependencies, and runs cleanly on the Workers runtime.

**Alternative considered**: `micromark` or `remark` pipeline — more flexible but heavier and more complex to configure for a simple reading scenario.

---

### 3. Chapter Identifier — Zero-padded string number (e.g., `"00001"`)

**Decision**: Use the zero-padded filename stem as the chapter identifier everywhere — in URLs, in `getNovelChapterData(slug, "00001")`, and in the chapter list returned by `getNovel()`.

**Rationale**: The R2 path `chapters/00001.md` already establishes the convention. Using the stem directly means zero transformation between URL param, R2 key, and function argument. Zero-padding ensures correct lexicographic sort order from R2's `list()` API, so chapter order is always correct without secondary sorting.

**Alternative considered**: Auto-incrementing integer chapter numbers parsed from filenames — adds a parsing step and sort dependency; rejected for simplicity.

---

### 4. Cover Art Serving — Astro API proxy endpoint

**Decision**: Create `src/pages/api/r2/[...path].ts` that proxies R2 object reads and streams them back with the correct `Content-Type`. Cover art `src` attributes in the UI point to `/api/r2/novels/{slug}/assets/cover_art.{ext}`.

**Rationale**: R2 buckets are not publicly accessible by default. We cannot generate permanent public URLs without enabling public bucket access (which is a deployment concern outside this scope). An API proxy route is the safest default: it keeps the bucket private and works immediately with no Cloudflare dashboard configuration.

**Alternative considered**: R2 presigned URLs — time-limited and require an extra signing step; adds complexity and TTL management.

---

### 5. Component Architecture

```
src/
├── components/                     # Global atomic components (reusable across all features)
│   ├── StatusBadge.astro           # Status pill (ongoing/completed/hiatus)
│   ├── GenreTag.astro              # Genre/tag pill
│   ├── EmptyState.astro            # Empty state with icon + message
│   └── NovelCard.astro             # Novel card with cover + metadata
├── features/novel-viewer/          # Novel viewer feature
│   ├── components/                 # Feature-specific components
│   │   └── ChapterNav.astro        # Chapter prev/next navigation
│   ├── NovelGrid.astro             # Grid of NovelCard, handles loading/empty
│   ├── NovelDetailHeader.astro     # Cover art, title, author, meta, genre tags
│   ├── ChapterList.astro           # Scrollable chapter index
│   └── ChapterReader.astro         # Rendered markdown + prev/next nav
├── lib/r2/                         # Atomic R2 functions (no UI)
│   └── index.ts
├── pages/
│   ├── novels/
│   │   ├── index.astro             # Novel list page
│   │   └── [slug]/
│   │       ├── index.astro         # Novel detail page
│   │       └── chapters/
│   │           └── [chapter].astro # Chapter reader page
│   └── api/r2/
│       └── [...path].ts            # R2 proxy endpoint
```

**Component Separation Rationale:**
- `src/components/` contains atomic, reusable UI primitives that can be used by ANY feature (globally available)
- `src/features/*/components/` contains components tightly coupled to that specific feature's domain logic
- Pages contain only data-fetching + component composition. All rendering logic lives in feature components.

---

### 6. Design System — Tailwind v4 `@theme` in `globals.css`

**Decision**: Define all design tokens as CSS custom properties under Tailwind v4's `@theme` block in `globals.css`. Use semantic aliases (`--color-primary`, `--color-surface`, etc.) that map to palette primitives. Dark mode via `.dark` class override.

```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(55% 0.22 260);
  --color-primary-hover: oklch(50% 0.22 260);
  --color-secondary: oklch(60% 0.15 310);
  --color-success: oklch(65% 0.18 145);
  --color-warning: oklch(70% 0.18 80);
  --color-danger: oklch(55% 0.22 25);
  --color-surface: oklch(99% 0 0);
  --color-surface-alt: oklch(96% 0 0);
  --color-border: oklch(87% 0 0);
  --color-text: oklch(15% 0 0);
  --color-text-muted: oklch(45% 0 0);
  /* Dark overrides on .dark */
}
```

**Alternative considered**: Separate `tailwind.config.ts` — not compatible with Tailwind v4's CSS-first approach.

## Risks / Trade-offs

- **R2 cold latency** → `getNovelList()` calls `list()` + N `get()` calls for meta.json (one per novel). This may be slow with many novels. Mitigation: initially acceptable; can add pagination or a manifest file later.
- **Markdown XSS** → `marked` by default does not sanitize HTML in markdown. Chapters are authored content from R2 (trusted source), but if untrusted content ever enters R2, this becomes a risk. Mitigation: set `{ mangle: false, headerIds: false }` and consider `DOMPurify` on client if needed in future.
- **R2 proxy endpoint** → Every image request goes through the Worker, consuming CPU time. Mitigation: acceptable for a low-traffic reader; can add R2 public bucket or cache rules later.
- **No pagination** → Novel list loads all novels' meta.json in parallel. Mitigation: use `p-queue` to limit concurrency (already installed).

## Open Questions

- ~~What fields should `meta.json` contain?~~ — Resolved in proposal: title, author, description, status, genre, tags, language, publishedAt, updatedAt.
- Should the root `/` redirect to `/novels` or serve the novel list directly? → For now, serve the list at `/novels` and keep `/` as a landing/index (can be expanded).
- Should chapters have titles defined in markdown frontmatter, or just chapter numbers? → Spec defaults to frontmatter `title` field being optional; if absent, display "Chapter {number}".
