# site-shared-ui

Presentation primitives of `apps/site` in the «Строчка» theme: shadcn/ui (`new-york`) on Radix UI with Tailwind CSS v4. Tokens live in `apps/site/src/app/global.css`; the rules are in the [site design system](../../../../docs/standards/site/design-system.md).

- `Button`, `buttonVariants` — graphite main action, outlined and ghost variants, 44 px tall.
- `Sheet*` — side panel on Radix Dialog, used by the mobile menu.
- `StitchLabel` — the signature number, dashed seam, and mono caption («01 — ШИЄМО САМІ»).
- `PageSection` — page block frame: stitch label, `h2`, action link.
- `Breadcrumbs` — breadcrumb trail; the last item is the current page.
- `cn` — class name merge.

New primitives: `npx shadcn@latest add <component>` from this folder (`components.json`), then trim to the tokens above.

Tests: `npx nx test site-shared-ui`.
