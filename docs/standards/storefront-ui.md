# Storefront UI Rules

These rules apply to the Angular Storefront with PrimeNG; React Admin uses its
[own UI rules](admin/admin-ui.md).

## PrimeNG styling

- For PrimeNG UI changes, use existing Tailwind classes in templates or PrimeNG `pt` configurations.
- Do not change component or global CSS for a local PrimeNG task unless its scope directly requires it.
- Do not change global theme tokens or replace the current styling strategy for a local feature.

Before making a change, check the current components, theme, and classes in the
relevant application code. Determine rules for other UI aspects from the
relevant architecture and current components.
