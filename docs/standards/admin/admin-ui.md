# Admin UI Rules

## Language and components

- Write visible strings, accessible names, empty/error messages, and feature specs in Ukrainian.
- Use existing MUI patterns and theme; do not create local design tokens without a need.
- Use existing MUI components for tables, dialogs, selects, pagination, and other complex business controls.
- Do not change global styles, theme, or routing for a local feature.

## States and accessibility

- Each screen with server data defines applicable `loading`, `success`, `empty`, `error`, and `forbidden` states.
- Error states show a clear message without transport details and an available retry action when possible.
- Interactive elements use semantic HTML, keyboard navigation, visible focus, and an accessible name.
- Icon-only controls have an `aria-label` or existing equivalent.
- Check layout at the agreed narrow and wide breakpoints.

## UI verification

- `SC-*` describes the expected user outcome and does not replace a test file.
- A new interaction or change to loading, empty, error, forbidden, or success behavior requires a focused component test once a suitable test target is configured.
- Automate keyboard, focus, and accessible-name behavior at component level when the DOM environment reproduces the risk; use E2E for a real browser journey only for a critical flow.
- Record visual checks of breakpoints and theme as manual evidence until the repository has agreed visual regression tooling.
