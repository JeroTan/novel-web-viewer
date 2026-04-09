## ADDED Requirements

### Requirement: Novel detail page renders metadata and chapter list
The system SHALL render a `/novels/[slug]` page that fetches the novel via `getNovel(slug)` and displays: a `NovelDetailHeader` (cover art, title, author, description, genre tags, status badge) and a `ChapterList` (sorted chapter entries).

#### Scenario: novel found
- **WHEN** a valid `slug` parameter matches a novel in R2
- **THEN** the page renders `NovelDetailHeader` and `ChapterList` with the novel's data

#### Scenario: novel not found
- **WHEN** `getNovel(slug)` returns `null`
- **THEN** the page returns HTTP 404 using `Astro.redirect('/404')` or a 404 response

---

### Requirement: NovelDetailHeader feature component
The system SHALL provide a `NovelDetailHeader.astro` component that displays: cover art image (or placeholder), title, author, description, `StatusBadge`, language, published/updated dates, and a row of `GenreTag` components for each genre. Layout SHALL be responsive (stacked on mobile, side-by-side on desktop). The cover art image SHALL be clickable and open a `CoverArtLightbox` overlay.

#### Scenario: full metadata available
- **WHEN** all meta fields are populated
- **THEN** all fields are rendered; genre tags appear as a flex-wrap row

#### Scenario: optional fields absent
- **WHEN** description or tags are empty arrays
- **THEN** those sections are hidden gracefully with no visible empty gaps

#### Scenario: cover art is clickable
- **WHEN** the user clicks the cover art image in `NovelDetailHeader`
- **THEN** the `CoverArtLightbox` overlay opens showing a zoomed view of the cover

---

### Requirement: CoverArtLightbox component
The system SHALL provide a `CoverArtLightbox.astro` component (in `src/features/novel-viewer/components/`) that renders a full-screen modal overlay with the cover art image. The lightbox SHALL support:
- **Zoom in / zoom out** via `+`/`-` buttons and mouse scroll wheel
- **Pan** by click-and-drag when zoomed in
- **Close** via a close button, pressing `Escape`, or clicking the backdrop
- Zoom SHALL clamp between 1× (fit) and 5×
- The component accepts `src: string` and `alt: string` props
- The overlay is implemented purely with inline `<script>` and CSS (no external dependencies)

#### Scenario: open lightbox
- **WHEN** the cover art is clicked
- **THEN** a full-screen dark overlay appears with the cover image centered and fit to the viewport

#### Scenario: zoom in
- **WHEN** user clicks `+` or scrolls up on the image
- **THEN** the image scales up (max 5×), centered on the pointer position

#### Scenario: zoom out
- **WHEN** user clicks `-` or scrolls down
- **THEN** the image scales down, clamping at 1× (no smaller than fit)

#### Scenario: pan
- **WHEN** the image is zoomed in and user click-drags
- **THEN** the image pans following the pointer

#### Scenario: close
- **WHEN** user presses `Escape`, clicks the `✕` button, or clicks the backdrop outside the image
- **THEN** the overlay closes and focus returns to the page

---

### Requirement: GenreTag atomic component
The system SHALL provide a `GenreTag.astro` global atomic component (in `src/components/`) that renders a single genre string as a styled pill using `--color-secondary`.

#### Scenario: genre tag render
- **WHEN** passed a genre string like "fantasy"
- **THEN** renders a rounded pill with the genre text

---

### Requirement: ChapterList feature component
The system SHALL provide a `ChapterList.astro` component that renders a scrollable, numbered list of chapters. Each item SHALL display the chapter number and optional title, and link to `/novels/{slug}/chapters/{chapterNumber}`. Items SHALL visually distinguish odd/even rows for readability.

#### Scenario: chapters available
- **WHEN** the novel has chapters in its chapters array
- **THEN** each chapter is rendered as a clickable list item in ascending order

#### Scenario: no chapters
- **WHEN** the chapters array is empty
- **THEN** a message "No chapters available yet" is displayed

---

### Requirement: Novel detail page SEO
The novel detail page SHALL include a `<title>` with the novel title, a `<meta name="description">` with the novel description, and Open Graph `og:title`, `og:description`, and `og:image` (pointing to the R2 cover art proxy URL or omitted if null).

#### Scenario: OG meta with cover art
- **WHEN** the novel has a cover art key
- **THEN** `og:image` is set to `/api/r2/{coverArtKey}`

#### Scenario: OG meta without cover art
- **WHEN** the novel has no cover art
- **THEN** `og:image` tag is omitted from the head
