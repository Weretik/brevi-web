# site-request-model

Data of the «Заявка» form without React. See the [feature card](../../../../docs/features/site/request.md).

- `request-form.ts` — the fields, the form state (`idle`, `invalid`, `unavailable`, `sent`), field limits, allowed file formats and size.
- `validators/request-validators.ts` — Ukrainian phone normalizing and formatting, field cleaning, `validateRequest`, `validateRequestAttachment`.

Tests: `npx nx test site-request-model`.
