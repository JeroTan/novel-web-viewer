# Novel Content Formatting Guide for R2 Upload

This document provides the file structure and format specifications for preparing novel content to be uploaded to the Cloudflare R2 bucket (`NOVEL_VIEWER_STORAGE`) for the novel-web-viewer application.

## R2 Directory Structure

Each novel MUST follow this exact structure in R2:

```
novels/
└── {novel-slug}/
    ├── meta.json
    ├── chapters/
    │   ├── 00001.md
    │   ├── 00002.md
    │   ├── 00003.md
    │   └── ... (continue numbering)
    └── assets/
        └── cover_art.{jpg|png|webp}
```

### Path Conventions

- **Novel slug**: Use kebab-case (lowercase with hyphens). Example: `the-wandering-immortal`, `sword-masters-journey`
- **Chapter numbering**: Zero-padded 5-digit numbers (`00001`, `00002`, ..., `99999`)
- **Cover art**: Must be named `cover_art` with a supported extension (`.jpg`, `.png`, `.webp`)

## `meta.json` Format

Each novel MUST have a `meta.json` file at `novels/{novel-slug}/meta.json` with the following structure:

```json
{
  "title": "The Wandering Immortal",
  "author": "Author Name",
  "description": "A captivating story of cultivation and adventure. This description appears on novel cards and the detail page. Keep it concise but compelling (2-3 sentences recommended).",
  "status": "ongoing",
  "genre": ["fantasy", "cultivation"],
  "tags": ["reincarnation", "magic-system", "weak-to-strong"],
  "language": "en",
  "publishedAt": "2024-01-15",
  "updatedAt": "2024-12-01"
}
```

### Field Specifications

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | ✅ Required | The novel's display title |
| `author` | `string` | ✅ Required | Author's name or pen name |
| `description` | `string` | ✅ Required | Brief synopsis shown in novel cards and detail page. 2-3 sentences recommended. |
| `status` | `enum` | ✅ Required | Must be one of: `"ongoing"`, `"completed"`, `"hiatus"` |
| `genre` | `string[]` | ✅ Required | Array of genre tags (lowercase, kebab-case). Examples: `"fantasy"`, `"sci-fi"`, `"romance"`, `"mystery"`, `"slice-of-life"` |
| `tags` | `string[]` | ⚠️ Optional | Additional descriptive tags (lowercase, kebab-case). Examples: `"reincarnation"`, `"time-travel"`, `"magic-system"`, `"weak-to-strong"` |
| `language` | `string` | ✅ Required | ISO 639-1 language code. Examples: `"en"`, `"es"`, `"zh"`, `"ja"` |
| `publishedAt` | `string` | ✅ Required | ISO 8601 date when the novel was first published. Format: `YYYY-MM-DD` |
| `updatedAt` | `string` | ✅ Required | ISO 8601 date of the last chapter update. Format: `YYYY-MM-DD` |

### Example `meta.json` Files

**Fantasy Novel:**
```json
{
  "title": "Sword Master's Journey",
  "author": "Wei Chen",
  "description": "A young blacksmith discovers an ancient sword technique that sets him on a path to become the greatest sword master in history. But power comes with a price.",
  "status": "ongoing",
  "genre": ["fantasy", "action", "cultivation"],
  "tags": ["swords", "martial-arts", "weak-to-strong", "master-disciple"],
  "language": "en",
  "publishedAt": "2025-03-12",
  "updatedAt": "2026-04-05"
}
```

**Science Fiction Novel:**
```json
{
  "title": "Echoes of the Void",
  "author": "Sarah Kim",
  "description": "When humanity's first faster-than-light ship vanishes into deep space, a rescue mission uncovers secrets that threaten the fabric of reality itself.",
  "status": "completed",
  "genre": ["sci-fi", "thriller", "space-opera"],
  "tags": ["space-exploration", "aliens", "mystery", "hard-sci-fi"],
  "language": "en",
  "publishedAt": "2024-06-01",
  "updatedAt": "2025-11-30"
}
```

## Chapter File Format (`.md`)

Each chapter file is a Markdown document with optional YAML frontmatter.

### File Path
`novels/{novel-slug}/chapters/{chapter-number}.md`

Example: `novels/the-wandering-immortal/chapters/00001.md`

### Frontmatter (Optional)

```yaml
---
title: The Awakening
---
```

- **`title`** (optional): Human-readable chapter title. If omitted, the reader will display "Chapter {number}" (e.g., "Chapter 1")

### Chapter Content

The chapter body is standard Markdown. Supported elements:

- **Headings**: `#`, `##`, `###` (avoid using `#` as it conflicts with the chapter title)
- **Paragraphs**: Separate with blank lines
- **Emphasis**: `*italic*`, `**bold**`
- **Lists**: Unordered (`-`) and ordered (`1.`)
- **Blockquotes**: `> quoted text`
- **Code blocks**: Triple backticks
- **Horizontal rules**: `---`

**Do NOT use:**
- Inline HTML (it will be rendered as text for security)
- Embedded images (use descriptive text instead)
- External links (or use with caution)

### Example Chapter File

**`novels/my-novel/chapters/00001.md`:**
```markdown
---
title: The Awakening
---

The morning sun crept through the wooden shutters, casting long shadows across the dusty workshop floor. Li Wei sat cross-legged on the cold stone, his eyes closed in meditation.

He had been practicing the *Iron Body Technique* for three years now, but today felt different. The qi flowing through his meridians moved with an unfamiliar intensity.

"Focus," he whispered to himself. "It's almost time."

## The Breakthrough

As the sun reached its zenith, Li Wei felt a sudden surge of energy. His body began to tremble—not from weakness, but from an overwhelming power awakening within.

This was the moment he had been waiting for.

---

*To be continued...*
```

## Cover Art Requirements

### File Specifications
- **Path**: `novels/{novel-slug}/assets/cover_art.{extension}`
- **Supported formats**: `.jpg`, `.jpeg`, `.png`, `.webp`
- **Recommended dimensions**: 800x1200px (2:3 aspect ratio) minimum
- **File size**: Under 500KB recommended for fast loading
- **Quality**: High-quality, legible at thumbnail sizes

### Naming Convention
The file MUST be named exactly `cover_art` with a supported extension:
- ✅ `cover_art.jpg`
- ✅ `cover_art.png`
- ✅ `cover_art.webp`
- ❌ `cover.jpg` (incorrect name)
- ❌ `cover_art_v2.png` (no suffixes allowed)

If no cover art is provided, the viewer will display a placeholder with the novel's initials.

## Upload Checklist

Before uploading a novel to R2, verify:

- [ ] `meta.json` exists at `novels/{slug}/meta.json`
- [ ] All required fields in `meta.json` are present and valid
- [ ] `status` is one of: `"ongoing"`, `"completed"`, `"hiatus"`
- [ ] `genre` array has at least one entry
- [ ] Dates in `meta.json` use `YYYY-MM-DD` format
- [ ] Chapter files are numbered starting from `00001.md`
- [ ] Chapter numbers are zero-padded to 5 digits
- [ ] Each chapter is valid Markdown
- [ ] Cover art (if provided) is named `cover_art.{jpg|png|webp}`
- [ ] All paths use forward slashes and lowercase (except file extensions)

## R2 Upload Methods

### Using Wrangler CLI

```bash
# Upload meta.json
wrangler r2 object put NOVEL_VIEWER_STORAGE/novels/my-novel/meta.json --file=./meta.json

# Upload a chapter
wrangler r2 object put NOVEL_VIEWER_STORAGE/novels/my-novel/chapters/00001.md --file=./chapters/00001.md

# Upload cover art
wrangler r2 object put NOVEL_VIEWER_STORAGE/novels/my-novel/assets/cover_art.jpg --file=./cover_art.jpg
```

### Bulk Upload Script Example

```bash
#!/bin/bash
NOVEL_SLUG="my-novel"
BUCKET="NOVEL_VIEWER_STORAGE"

# Upload meta
wrangler r2 object put $BUCKET/novels/$NOVEL_SLUG/meta.json --file=./meta.json

# Upload all chapters
for chapter in chapters/*.md; do
  filename=$(basename "$chapter")
  wrangler r2 object put $BUCKET/novels/$NOVEL_SLUG/chapters/$filename --file="$chapter"
done

# Upload cover art
wrangler r2 object put $BUCKET/novels/$NOVEL_SLUG/assets/cover_art.jpg --file=./cover_art.jpg
```

## Validation Tips

### Validate JSON
Before uploading, validate your `meta.json`:
```bash
# Using jq
jq empty meta.json && echo "Valid JSON" || echo "Invalid JSON"
```

### Validate Markdown
Test your Markdown renders correctly using any Markdown preview tool before uploading.

### Check File Names
Ensure chapter numbering is sequential and zero-padded:
```bash
# List chapter files
ls -1 chapters/ | sort
# Expected output:
# 00001.md
# 00002.md
# 00003.md
```

## Common Mistakes to Avoid

1. ❌ Using spaces in the novel slug → ✅ Use hyphens instead
2. ❌ Chapter files like `1.md`, `2.md` → ✅ Use `00001.md`, `00002.md`
3. ❌ Missing required fields in `meta.json` → ✅ Double-check all required fields
4. ❌ Using incorrect status values → ✅ Only use: `ongoing`, `completed`, `hiatus`
5. ❌ Cover art with wrong name → ✅ Must be named `cover_art.{ext}`
6. ❌ HTML tags in Markdown → ✅ Use pure Markdown syntax
7. ❌ Inconsistent date formats → ✅ Always use `YYYY-MM-DD`

---

## Quick Reference Card

```
Structure:
  novels/{slug}/meta.json
  novels/{slug}/chapters/00001.md
  novels/{slug}/assets/cover_art.jpg

meta.json required fields:
  title, author, description, status, genre, language, publishedAt, updatedAt

Chapter frontmatter (optional):
  ---
  title: Chapter Title Here
  ---

Status values:
  "ongoing" | "completed" | "hiatus"
```

---

**Need Help?**
- Check existing novels in R2 for reference examples
- Validate JSON before uploading: https://jsonlint.com/
- Test Markdown rendering: https://markdownlivepreview.com/
