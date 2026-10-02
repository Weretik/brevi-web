# EN-001 — GET-by-ID контракти операцій

- **ID задачі:** EN-001
- **Статус:** deferred — не потрібна для погодженого Drawer scope
- **Уможливлює:** SC-004–SC-006
- **Залежить від:** немає
- **Точні шляхи:** backend garment parts/operations OpenAPI, frontend snapshot/types
- **Рівень тестування:** контрактний

## Робота

- [ ] Додати `getGarmentPartById` і `getGarmentPartOperationById` з 404.
- [ ] Зафіксувати backend SHA, sync/generate/check snapshot і types.
- [ ] Не створювати ручних transport DTO; перевірити tooling boundaries.

## Свідчення

- Behavioral Red неможливий без operationId.
- Replacement: contracts sync/generate/check і provenance.
- Уможливлює TS-001.
- 2026-10-01: перевірено upstream `BreviERP` HEAD
  `5d97cc098ade99068d1da70ccc0f6562ec852f2c`; OpenAPI й controllers містять
  list/create/update/delete, але не містять `getGarmentPartById` та
  `getGarmentPartOperationById`.
- `npm run contracts:check` — success для чинного pinned snapshot
  `e4c1588659684f3d5174fc6dfbfd5bfbd420a6ea`; це підтверджує цілісність
  snapshot/types, але не усуває відсутність двох operationId.

## Blocker

Backend має реалізувати й опублікувати обидва GET-by-ID з row-compatible 200,
404 та authentication/error contract у immutable commit. Без цього frontend не
може sync/generate detail types, а ручні DTO заборонені contract boundary.

## Контрольна точка

Дві generated GET operations доступні з immutable source commit.
