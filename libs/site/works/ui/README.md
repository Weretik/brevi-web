# site-works-ui

Blocks of the «Наші роботи» page in the «Строчка» design. Server Components only. See the [feature card](../../../../docs/features/site/works.md).

- `data/work-photos.ts` — the list of gallery photos (`WORK_PHOTOS`) and the paths of the large file and the thumbnail.
- `i18n/works-dictionary.ts` — page text in `uk` and `ru`.
- `sections/` — `WorksGallery` (masonry of thumbnails, each opens the large photo), `WorksOrder` (call to order).

Photos live in `apps/site/public/assets/works/` as `work-NNN.webp` and `work-NNN-thumb.webp`.

Tests: `npx nx test site-works-ui`.
