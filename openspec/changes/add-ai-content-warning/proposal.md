## Why

As AI-generated content becomes more prevalent, transparency with readers is essential. Users should be aware that some works hosted on the platform may contain AI-generated text or involve AI assistance acting as an editor on behalf of the authors. Adding a clear but unobtrusive disclaimer sets appropriate reader expectations.

## What Changes

- Add a UI disclaimer stating: "Disclaimer: Some works hosted here may contain AI-generated content or involve AI assistance in the writing and editing process. Please proceed with this in mind and enjoy the stories."
- The disclaimer should be placed prominently but naturally within the UI: on the home page (Discover), at the very bottom of the novel list page as a reminder, and at the end of chapters.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `home-page`: Add the AI content disclaimer to the home landing page ("Discover and read novels online").
- `novel-list-page`: Add the AI content disclaimer to the very bottom of the novel list page as a reminder.
- `novel-chapter-reader`: Add the AI content disclaimer at the end of the chapter content.

## Impact

- **UI/Components**: Requires a new global component for the disclaimer to ensure consistent styling.
- **Pages**: Updates to the home page, novel list page, and chapter reader pages.
