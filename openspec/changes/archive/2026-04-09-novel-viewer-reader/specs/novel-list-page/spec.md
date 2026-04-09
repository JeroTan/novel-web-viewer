## ADDED Requirements

### Requirement: Novel list page renders all novels
The system SHALL render a `/novels` page that displays all novels returned by `getNovelList()` as a responsive grid of novel cards. Each card SHALL display: cover art (or a placeholder if null), title, author, and a status badge.

#### Scenario: novels exist
- **WHEN** `getNovelList()` returns one or more novels
- **THEN** the page renders a grid of `NovelCard` components, one per novel, each linking to `/novels/{slug}`

#### Scenario: R2 is empty
- **WHEN** `getNovelList()` returns an empty array
- **THEN** the page renders the `EmptyState` component with a message indicating no novels are available yet

---

### Requirement: NovelCard atomic component
The system SHALL provide a `NovelCard.astro` global atomic component (in `src/components/`) that accepts a novel summary and renders: cover art image (via `/api/r2/{coverArtKey}` or a placeholder SVG), title, author, and a `StatusBadge`.

#### Scenario: cover art available
- **WHEN** `coverArtKey` is a non-null string
- **THEN** the card renders an `<img>` with `src="/api/r2/{coverArtKey}"` and a descriptive `alt` attribute

#### Scenario: cover art not available
- **WHEN** `coverArtKey` is `null`
- **THEN** the card renders a styled placeholder with the novel's initials or a book icon

---

### Requirement: StatusBadge atomic component
The system SHALL provide a `StatusBadge.astro` global atomic component (in `src/components/`) that renders a colored pill for `"ongoing"`, `"completed"`, or `"hiatus"` status values using the design system colors.

#### Scenario: ongoing status
- **WHEN** `status` is `"ongoing"`
- **THEN** badge renders in `--color-success` style with text "Ongoing"

#### Scenario: completed status
- **WHEN** `status` is `"completed"`
- **THEN** badge renders in `--color-primary` style with text "Completed"

#### Scenario: hiatus status
- **WHEN** `status` is `"hiatus"`
- **THEN** badge renders in `--color-warning` style with text "Hiatus"

---

### Requirement: EmptyState atomic component
The system SHALL provide an `EmptyState.astro` global atomic component (in `src/components/`) shown when a list has no items. It SHALL display an illustrative icon, a heading, and a descriptive sub-text. It SHALL accept `heading` and `description` props.

#### Scenario: empty novel shelf
- **WHEN** rendered on the novel list page with no novels
- **THEN** displays a book/shelf icon, "No Novels Yet" heading, and a friendly message

---

### Requirement: Novel list page SEO
The novel list page SHALL include a `<title>` tag and `<meta name="description">` reflecting the site name and purpose.

#### Scenario: page head
- **WHEN** the `/novels` page is rendered
- **THEN** the `<title>` contains the site name and the meta description is set

---

### Requirement: User-facing copy must be non-technical
All user-visible text (headings, descriptions, labels, SEO meta) SHALL NOT reference infrastructure or technical implementation details such as "Cloudflare", "R2", "Workers", "bucket", or "API". The app SHALL present as a normal novel reader to end users.

#### Scenario: home page copy
- **WHEN** a user visits `/`
- **THEN** the page description and body text describe the app as a novel reading experience, with no mention of underlying technology

#### Scenario: SEO meta descriptions
- **WHEN** any page renders its `<meta name="description">` tag
- **THEN** the description contains reader-friendly language only
