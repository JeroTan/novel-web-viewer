## ADDED Requirements

### Requirement: Design token definition in globals.css
The system SHALL define all visual design tokens as CSS custom properties under a Tailwind v4 `@theme` block in `src/styles/globals.css`. Tokens SHALL cover: color primitives (OKLCH), semantic color aliases, and dark-mode overrides.

**Required token set:**
```css
@theme {
  /* Color primitives */
  --color-primary:          oklch(55% 0.22 260);
  --color-primary-hover:    oklch(50% 0.22 260);
  --color-secondary:        oklch(60% 0.15 310);
  --color-success:          oklch(62% 0.18 145);
  --color-warning:          oklch(68% 0.17 80);
  --color-danger:           oklch(55% 0.22 25);

  /* Surface & text (light defaults) */
  --color-surface:          oklch(99% 0 0);
  --color-surface-alt:      oklch(95% 0.005 260);
  --color-border:           oklch(87% 0.005 260);
  --color-text:             oklch(15% 0 0);
  --color-text-muted:       oklch(48% 0 0);
  --color-text-on-primary:  oklch(99% 0 0);

  /* Typography */
  --font-size-xs:   0.75rem;
  --font-size-sm:   0.875rem;
  --font-size-base: 1rem;
  --font-size-lg:   1.125rem;
  --font-size-xl:   1.25rem;
  --font-size-2xl:  1.5rem;
  --font-size-3xl:  1.875rem;
  --font-size-4xl:  2.25rem;
}
```

Dark mode overrides SHALL be declared in a `.dark` selector block (NOT inside `@theme`):
```css
.dark {
  --color-surface:      oklch(14% 0.01 260);
  --color-surface-alt:  oklch(18% 0.01 260);
  --color-border:       oklch(28% 0.01 260);
  --color-text:         oklch(93% 0 0);
  --color-text-muted:   oklch(62% 0 0);
}
```

#### Scenario: light mode tokens accessible
- **WHEN** a component uses `bg-[var(--color-surface)]` in light mode
- **THEN** the background resolves to the light surface OKLCH value

#### Scenario: dark mode token overrides
- **WHEN** the `.dark` class is on `<html>` and a component uses `bg-[var(--color-surface)]`
- **THEN** the background resolves to the dark surface OKLCH value

---

### Requirement: Responsive layout utilities
The design system SHALL support a responsive layout via Tailwind v4 breakpoints. The novel grid SHALL display 1 column on mobile, 2 on tablet (`md:`), and 3–4 on desktop (`lg:`/`xl:`). The chapter reader SHALL have a max-width container centered on desktop.

#### Scenario: mobile novel grid
- **WHEN** viewport is < 768px
- **THEN** novel cards stack in a single column

#### Scenario: desktop novel grid
- **WHEN** viewport is ≥ 1024px
- **THEN** novel cards display in a 3 or 4 column grid

---

### Requirement: Dark mode toggle persistence
The `ThemeScript.astro` (already implemented) handles dark/light mode persistence via `localStorage`. All new components SHALL rely solely on the `.dark` class on `<html>` and CSS custom property overrides — no inline conditional class logic needed.

#### Scenario: theme persisted across reload
- **WHEN** user's stored theme is "dark" and the page reloads
- **THEN** the `.dark` class is applied before first paint (no flash of unstyled content)
