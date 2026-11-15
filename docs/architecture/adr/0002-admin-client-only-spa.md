# ADR-0002: The admin is a client-only React SPA, hidden from search

**Status:** accepted
**Decision date:** 2026-11-15 (recorded from the current code)
**Owners:** product owner, frontend
**Applications:** Admin (`apps/admin-react`)

## Context

The admin is used only by signed-in staff. It has dense tables, forms, drawers and many client-side states, and no page should ever appear in search. The public site has the opposite needs: server rendering and SEO. The backend keeps the browser session in an HttpOnly cookie behind `api.brevi.com.ua`.

## Options

| Option                                        | Complexity | Performance                                   | Risks                                      | Evidence                      |
| --------------------------------------------- | ---------- | --------------------------------------------- | ------------------------------------------ | ----------------------------- |
| Next.js with server rendering, like the site  | high       | faster first paint, not needed behind sign-in | server runtime and cost for a private tool | —                             |
| Client-only React SPA on Vite, static hosting | low        | fast after the first load                     | must be kept out of search by hand         | `apps/admin-react/index.html` |

## Decision and reason

- The admin is a React 19 SPA built with Vite, with MUI with the design system «Цех», Redux Toolkit / RTK Query for server state and one Axios transport (Admin ADR-0001).
- It is served as static files from Cloudflare Pages (project `brevi-web`, domain `office.brevi.com.ua`).
- `index.html` sets `<meta name="robots" content="noindex, nofollow">`; the admin has no sitemap and no SEO work.
- Sign-in uses the backend cookie session with a CSRF header; no token is kept in browser storage.

## Consequences and verification

- Simpler: no server runtime, cheap hosting, one rendering model.
- Harder: the first load downloads the app; routes are lazy-loaded to keep it small.
- The audit checks the `noindex` meta and that no admin code sits in site libraries.
