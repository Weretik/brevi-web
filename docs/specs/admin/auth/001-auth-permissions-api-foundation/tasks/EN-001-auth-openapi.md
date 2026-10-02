# EN-001 — Versioned auth OpenAPI

- **ID задачі:** EN-001
- **Уможливлює:** SC-001, SC-003, SC-004, SC-005, SC-008
- **Залежить від:** немає
- **Точні шляхи:** backend `docs/sdd/contracts/openapi.yaml`;
  `docs/contracts/openapi/backend/`, `docs/contracts/openapi/SOURCE.json`,
  `libs/admin/shared/contracts/src/generated/openapi.ts`
- **Рівень тестування:** contract/tooling verification

## Робота

- [x] У backend versioned OpenAPI додати login, refresh, logout і me з
      канонічними `operationId`, request/response schemas, cookies/CSRF,
      Bearer security та 400/401/403 semantics.
- [x] Зафіксувати immutable backend commit і синхронізувати frontend snapshot.
- [x] Згенерувати types; не переносити ручні DTO з `kedr-web`.
- [x] Запустити `contracts:sync`, `contracts:generate`, `contracts:check` і
      підтвердити operation types через public contracts alias.
- [ ] Перевірити змінені contract files на єдину відповідальність і оновити
      `code-audit/audit.md`; snapshot/generated files не редагувати вручну.

## Свідчення

- Чому поведінковий Red не має сенсу: без канонічного contract test не може
  відрізнити правильну інтеграцію від вигаданого frontend DTO.
- Перевірені інструменти: наявні npm scripts `contracts:sync/generate/check`.
- Backend auth commit `a9e0c239b1263e3fbe882a0de238ab1ae95a81a5` перевірено:
  backend contract tests 5/5 passed; frontend sync і generate passed; generated
  types містять усі чотири operations.
- Backend commit `79cccf9b88168b726ac588640f6b397c0ed9afd4` відновив раніше
  versioned `deleteCatalogMedia`. `contracts:sync`, `contracts:generate` і
  `contracts:check` passed; snapshot і generated types відповідають provenance.
- Уможливлена поведінкова задача: TS-003 і TS-005.

## Контрольна точка

У snapshot є всі чотири auth operations та `deleteCatalogMedia` із generated
types й immutable provenance; `contracts:check` зелений.
