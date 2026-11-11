# Admin UI Rules

## Language and components

- Write visible strings, accessible names, empty/error messages, and feature specs in Ukrainian.
- Follow the [design system «Цех»](design-system.md) for every new screen: colors, type, density, page patterns, and the shell. Existing screens are restyled only on request.
- Use existing MUI patterns and theme; do not create local design tokens without a need.
- Use existing MUI components for tables, dialogs, selects, pagination, and other complex business controls.
- Do not change global styles, theme, or routing for a local feature.

## Texts for the site: visual editor, no typed markup

Owner rule of 2026-11-11: staff are ordinary users and do not know Markdown or any other markup.

- A long text that the site shows (description, text about a section, article) is edited in the shared visual editor `RichTextEditor` from `@admin/shared/ui`: a toolbar with heading, bold, italic, list, undo and redo, and the usual keys (Ctrl+B, Ctrl+I). Do not use a plain multiline field with marks such as `## `, `- `, or `**…**`, and do not explain markup in helper text.
- Structured data (short facts, characteristics, any «name: value» list) is edited as rows of fields with «Додати рядок» and a delete button per row, never as lines typed in one field.
- The view mode and previews show the formatting itself, never the stored marks.
- How the text is stored is hidden from staff. Product texts stay blocks of the BreviERP Content contract; bold and italic are kept inside the strings as `**…**` and `*…*` (a typed asterisk as `\*`), written and read only by code: `content-rich-text.ts` in `admin-content-model` and `catalog-inline.ts` in `site-catalog-model`.
- A new formatting option is added to the shared editor and to the site renderer together, so the site never shows raw marks.
- Short single-line fields (name, SEO title, SEO description) stay plain text fields with a character counter.

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
