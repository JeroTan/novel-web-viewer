## ADDED Requirements

### Requirement: Chapter reader page renders markdown content
The system SHALL render a `/novels/[slug]/chapters/[chapter]` page that fetches chapter data via `getNovelChapterData(slug, chapter)` and displays the HTML-rendered chapter body inside a `ChapterReader` component.

#### Scenario: chapter found
- **WHEN** valid `slug` and `chapter` params resolve to an existing R2 object
- **THEN** the rendered HTML is displayed inside a prose-styled container

#### Scenario: chapter not found
- **WHEN** `getNovelChapterData()` returns `null`
- **THEN** the page returns HTTP 404

---

### Requirement: ChapterReader feature component
The system SHALL provide a `ChapterReader.astro` component that accepts `html`, `title`, `chapterNumber`, `slug`, `prev`, and `next` props and renders: a chapter heading (title or "Chapter {number}"), the prose HTML content in a readable typography container, and a `ChapterNav` component.

#### Scenario: with chapter title
- **WHEN** frontmatter `title` is present
- **THEN** heading displays the title text

#### Scenario: without chapter title
- **WHEN** frontmatter `title` is absent or null
- **THEN** heading displays "Chapter {chapterNumber}" (with leading zeros stripped for display, e.g., "Chapter 1")

#### Scenario: prose readability
- **WHEN** HTML content is rendered
- **THEN** it is wrapped in a container with a max-width (e.g., `max-w-3xl`), comfortable line-height, and appropriate font size for long-form reading

---

### Requirement: ChapterNav atomic component
The system SHALL provide a `ChapterNav.astro` feature-specific component (in `src/features/novel-viewer/components/`) that renders a previous/next navigation bar. It SHALL appear both at the top and bottom of the chapter content. Buttons SHALL be disabled (visually) when `prev` or `next` is null.

#### Scenario: has both prev and next
- **WHEN** both `prev` and `next` are non-null chapter numbers
- **THEN** both "Previous Chapter" and "Next Chapter" links are rendered as active anchor tags

#### Scenario: first chapter
- **WHEN** `prev` is `null`
- **THEN** the "Previous Chapter" button is rendered but visually disabled (no href, muted color)

#### Scenario: last chapter
- **WHEN** `next` is `null`
- **THEN** the "Next Chapter" button is rendered but visually disabled

---

### Requirement: ReaderFormatStyle wrapper component
The system SHALL provide a `ReaderFormatStyle.astro` component (in `src/features/novel-viewer/components/`) that accepts a default `<slot />` and wraps its children in a container with fully explicit prose CSS applied via `<style is:global>` scoped to a unique class name. All styles SHALL use `!important` or sufficiently high specificity to override Tailwind v4 Preflight resets on injected HTML elements (`p`, `h1`–`h6`, `blockquote`, `hr`, `em`, `strong`, `ul`, `ol`, `li`, `a`, `code`, `pre`).

**Rationale**: Astro scoped styles do not penetrate `set:html` injected content. Tailwind v4 Preflight resets browser defaults (margins, font sizes, font weights) on all elements. The only reliable solution is `<style is:global>` scoped to a unique wrapper class, ensuring injected HTML renders with readable prose formatting regardless of Tailwind resets.

#### Scenario: paragraph spacing
- **WHEN** a chapter body contains multiple paragraphs
- **THEN** each `<p>` has visible bottom margin (`1.25em` minimum) so paragraphs are clearly separated

#### Scenario: heading hierarchy
- **WHEN** the chapter body contains `<h2>` or `<h3>` elements
- **THEN** they render larger and bolder than body text with top margin for visual separation

#### Scenario: blockquote style
- **WHEN** the chapter body contains a `<blockquote>`
- **THEN** it renders with a left border and muted italic text

#### Scenario: Tailwind reset does not win
- **WHEN** Tailwind Preflight is active
- **THEN** `ReaderFormatStyle` styles still apply correctly to all child elements

---

### Requirement: Chapter reader typography and dark mode
The chapter content container SHALL use readable prose styles: minimum `1rem` font size, `1.75` line-height, comfortable paragraph spacing. In dark mode (`.dark` class on `html`), background SHALL switch to a dark surface and text to a near-white color.

#### Scenario: light mode
- **WHEN** the `.dark` class is absent from `<html>`
- **THEN** the reader uses `--color-surface` background and `--color-text` foreground

#### Scenario: dark mode
- **WHEN** the `.dark` class is present on `<html>`
- **THEN** the reader uses dark surface and light text colors from the design system

---

### Requirement: Chapter reader page SEO
The chapter page SHALL set a `<title>` formatted as `"{chapter title or number} — {novel title}"` and a canonical URL.

#### Scenario: page title
- **WHEN** the chapter reader page is rendered
- **THEN** `<title>` contains both the chapter identifier and the novel title
