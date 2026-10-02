# EN-001 — Create/detail/delete contracts

- **ID задачі:** EN-001
- **Уможливлює:** SC-003–SC-006
- **Залежить від:** немає
- **Точні шляхи:** backend additional references OpenAPI, aggregated contract,
  frontend snapshot/generated types
- **Рівень тестування:** contract/setup
- **Статус:** blocked — backend contract не містить трьох required operations

## Робота

- [ ] Узгодити ID policy і додати `createAdditionalReference`.
- [ ] Додати `getAdditionalReferenceById` з 404.
- [ ] Додати `deleteAdditionalReference` з success/conflict semantics.
- [ ] Pin backend SHA, sync/generate/check snapshot/types/provenance.
- [ ] Не створювати manual DTO; audit contract tooling responsibility.

## Свідчення

- Behavioral Red неможливий без three operationId.
- Replacement: contract tests/commands and immutable provenance.
- Уможливлює TS-001.
- 2026-10-01: `rg` у pinned frontend snapshot
  `e4c1588659684f3d5174fc6dfbfd5bfbd420a6ea` знаходить лише
  `getAdditionalReferences` і `updateAdditionalReference`.
- 2026-10-01: перевірено актуальний backend `origin/master`
  `5d97cc098ade99068d1da70ccc0f6562ec852f2c`; файл
  `docs/sdd/contracts/reference/additional-references.openapi.yaml` так само
  містить лише list/update.
- Конкретний blocker: backend має погодити й опублікувати ID ownership,
  create request/response/status, detail response/404 та delete
  success/conflict/auth semantics. Frontend sync неможливий до появи цих
  operations у versioned OpenAPI.

## Контрольна точка

Три generated operations мають погоджені schemas і errors.
