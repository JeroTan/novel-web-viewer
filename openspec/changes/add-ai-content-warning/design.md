## Context

As part of adding an AI-generated content warning, we need to decide where and how this warning is rendered within the existing Astro application architecture. The application currently has a home page (`src/pages/index.astro`), a novel list page (`src/pages/novels/index.astro`), and a chapter reader page (`src/pages/novels/[slug]/chapters/[chapter].astro`).

## Goals / Non-Goals

**Goals:**
- Create a reusable, visually consistent UI component for the disclaimer.
- Integrate the disclaimer seamlessly into the `home-page`, `novel-list-page`, and `novel-chapter-reader` without disrupting the primary reading experience.
- Ensure the disclaimer text is reader-friendly, clear, and grammatically correct.

**Non-Goals:**
- Do not implement a system to automatically detect AI-generated content; this is a blanket disclaimer for the platform.
- Do not require user interaction (e.g., "I agree" checkboxes) to dismiss the warning.

## Decisions

**1. Create a Reusable Component: `AITransparencyDisclaimer.astro`**
We will create a new component in `src/components/AITransparencyDisclaimer.astro` to encapsulate the disclaimer text and styling.
*Rationale:* Ensures consistent styling across different pages. Easy to update the text in one place if needed in the future.

**2. Placement in Home Page ("Discover")**
The disclaimer will be placed on the home page (`src/pages/index.astro`), perhaps right below the main call-to-action button.
*Rationale:* Ensures users see it right when they land on the platform.

**3. Placement in Novel List Page**
The disclaimer will be placed at the very bottom of the `src/pages/novels/index.astro` page, below the novel grid, serving as a reminder.
*Rationale:* It provides a general warning for users discovering new novels.

**4. Placement in Chapter Reader**
The disclaimer will be placed at the end of the chapter content in `src/features/novel-viewer/ChapterReader.astro`, specifically between the chapter prose and the bottom `ChapterNav`.
*Rationale:* This ensures readers see the disclaimer as they finish a chapter.

## Risks / Trade-offs

- **[Risk] Visual Clutter** → Mitigation: Style the disclaimer to be unobtrusive (e.g., smaller text, muted colors, perhaps a subtle border or background) so it doesn't distract from the main content.
