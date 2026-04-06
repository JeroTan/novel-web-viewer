## ADDED Requirements

### Requirement: R2 novel list retrieval
The system SHALL provide a `getNovelList()` function that lists all novels from R2 by scanning `novels/` prefix, fetching each `novels/{slug}/meta.json`, and returning an array of novel summaries. Concurrency SHALL be limited to 10 parallel requests using `p-queue`.

#### Scenario: novels exist in R2
- **WHEN** R2 contains `novels/my-novel/meta.json` and `novels/another/meta.json`
- **THEN** `getNovelList()` returns an array of two novel objects each containing at minimum `slug`, `title`, `author`, and `status`

#### Scenario: R2 bucket is empty
- **WHEN** R2 contains no objects under `novels/`
- **THEN** `getNovelList()` returns an empty array `[]`

#### Scenario: one meta.json is malformed
- **WHEN** one novel's `meta.json` cannot be parsed as JSON
- **THEN** that novel is omitted from the list and the function logs a warning; other novels ARE still returned

---

### Requirement: R2 single novel retrieval
The system SHALL provide a `getNovel(slug: string)` function that fetches `novels/{slug}/meta.json`, lists `novels/{slug}/chapters/` to enumerate chapter keys, and returns a combined object with metadata plus a `chapters` array and `coverArtKey` string.

**Return type:**
```ts
{
  slug: string;
  title: string;
  author: string;
  description: string;
  status: "ongoing" | "completed" | "hiatus";
  genre: string[];
  tags: string[];
  language: string;
  publishedAt: string;
  updatedAt: string;
  chapters: { key: string; number: string; title?: string }[];
  coverArtKey: string | null;
}
```

#### Scenario: novel exists with chapters and cover art
- **WHEN** `slug` matches a novel folder with `meta.json`, chapter files, and a cover art asset
- **THEN** the returned object contains all meta fields, a `chapters` array sorted ascending by chapter number, and a non-null `coverArtKey`

#### Scenario: novel not found
- **WHEN** `slug` does not match any R2 prefix
- **THEN** `getNovel()` returns `null`

#### Scenario: novel has no cover art
- **WHEN** the `novels/{slug}/assets/` prefix has no `cover_art.*` file
- **THEN** `coverArtKey` is `null`

---

### Requirement: R2 cover art key lookup
The system SHALL provide a `getCoverArt(slug: string)` function that returns the R2 object key for the cover art file, or `null` if not found.

#### Scenario: cover art exists
- **WHEN** R2 has `novels/my-novel/assets/cover_art.jpg`
- **THEN** `getCoverArt("my-novel")` returns `"novels/my-novel/assets/cover_art.jpg"`

#### Scenario: cover art not present
- **WHEN** no file matching `cover_art.*` exists under `novels/{slug}/assets/`
- **THEN** `getCoverArt` returns `null`

---

### Requirement: R2 chapter data retrieval
The system SHALL provide a `getNovelChapterData(slug: string, chapterNumber: string)` function that fetches `novels/{slug}/chapters/{chapterNumber}.md` from R2, parses optional frontmatter for a `title` field, renders the markdown body to HTML using `marked`, and returns the rendered HTML along with navigation context (prev/next chapter numbers).

**Chapter number identifier rationale**: The zero-padded filename stem (e.g., `"00001"`) is used as the identifier because it maps 1:1 to the R2 key without transformation, and R2's lexicographic sort naturally produces correct chapter order.

#### Scenario: chapter exists
- **WHEN** `novels/my-novel/chapters/00001.md` exists in R2
- **THEN** the function returns `{ html: string; title: string | null; chapterNumber: string; prev: string | null; next: string | null }`

#### Scenario: chapter not found
- **WHEN** the requested chapter key does not exist in R2
- **THEN** the function returns `null`

---

### Requirement: R2 proxy image endpoint
The system SHALL expose a server-side API route at `GET /api/r2/[...path]` that reads the requested R2 object key and streams it back with the correct `Content-Type` header.

#### Scenario: image exists
- **WHEN** a request is made to `/api/r2/novels/my-novel/assets/cover_art.jpg`
- **THEN** the response contains the image bytes with `Content-Type: image/jpeg` and status `200`

#### Scenario: object not found
- **WHEN** the requested R2 key does not exist
- **THEN** the response returns status `404`
