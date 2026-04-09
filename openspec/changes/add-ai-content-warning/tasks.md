## 1. Components

- [x] 1.1 Create `src/components/AITransparencyDisclaimer.astro` — Implement the UI component for the AI content warning with unobtrusive styling (e.g., small text, muted colors). It should contain the text: "Disclaimer: Some works hosted here may contain AI-generated content or involve AI assistance in the writing and editing process. Please proceed with this in mind and enjoy the stories."

## 2. Page Integration

- [x] 2.1 Update `src/pages/index.astro` (home-page) — Import and render `AITransparencyDisclaimer` on the home page, positioned cleanly below the main text or call-to-action button.
- [x] 2.2 Update `src/pages/novels/index.astro` (novel-list-page) — Import and render `AITransparencyDisclaimer` at the very bottom of the page, below the novel grid and any empty state.
- [x] 2.3 Update `src/features/novel-viewer/ChapterReader.astro` (novel-chapter-reader) — Import and render `AITransparencyDisclaimer` at the end of the chapter content, specifically between the chapter prose and the bottom `ChapterNav`.

## 3. Verification

- [x] 3.1 Verify the disclaimer renders correctly on the home page.
- [x] 3.2 Verify the disclaimer renders correctly on the novel list page as a reminder and respects dark/light mode themes.
- [x] 3.3 Verify the disclaimer renders correctly on the chapter reader page without disrupting the reading flow or formatting.
