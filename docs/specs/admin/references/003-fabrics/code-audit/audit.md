# Аудит відповідальностей коду — Тканини

- **Feature:** `docs/specs/admin/references/003-fabrics/`
- **Scope:** уся feature
- **Дата:** 2026-09-28

## Перед реалізацією

- [x] Переглянуто наявні `libs/admin/references/{data-access,feature}`, спільну сторінку фурнітури, router, supplier lookup, Nx targets і тести.
- [x] API та runtime mapping належать data-access; стан запитів і дій — hooks; форма, таблиця й підтвердження — components; вкладки — сторінці; маршрут — app router.
- [x] `design/frontend.md` задає ці межі. Після першої реалізації сторінка фурнітури одночасно містила вкладки та її CRUD; незалежні ролі розділено під час цього аудиту без зміни URL.

## Після реалізації, до delivery checkpoint

- [x] Повторно переглянуто весь код feature, включно з backend OpenAPI, tooling, snapshot, generated types, supplier lookup, garment accessory сторінкою, router і тестами.
- [x] Відокремлено вкладки від оркестрації першої таблиці; перевірено напрям імпортів: generated operations лише в data-access, feature використовує його public API; циклів і дублювання supplier-моделі немає.
- [x] Занесено рішення для кожної області; після перенесення повторено фокусні тести, lint і typecheck.

## Результат аудиту

| Шлях або область                                                                                                   | Наявна й впроваджена відповідальність                           | Рішення та причина                                                                                                                                                      | Нові шляхи й межі імпортів                               | Перевірка                                                            |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------- |
| Backend `docs/sdd/contracts/openapi.yaml`, `reference/fabrics.openapi.yaml`                                        | Entry point і контракт тканин                                   | Залишити окремо: entry point містить тільки `$ref`, feature YAML володіє своїми операціями                                                                              | Snapshot синхронізується з зафіксованого commit          | `npm run contracts:check`                                            |
| `tools/contracts/contracts.mjs`, `docs/contracts/openapi/`, `libs/admin/api-contract/`                             | Sync/generate/check, provenance та generated types              | Залишити: один скрипт керує одним життєвим циклом контракту; snapshot і output машинні, ручного DTO немає                                                               | Feature не імпортує generated types напряму              | `npm run contracts:check`, `npx nx typecheck admin-api-contract`     |
| `data-access/src/fabrics/fabrics.api.ts`                                                                           | HTTP read/write одного endpoint та спільний `send`              | Залишити разом: одна transport boundary; окрема функція `send` спільна для чотирьох операцій                                                                            | Generated `operations` лише тут і в mapper               | `npx nx test admin-references-data-access`                           |
| `data-access/src/fabrics/fabrics.error.ts`, `fabrics.mapper.ts`, `fabrics.model.ts`                                | HTTP error mapping, runtime response mapping, модель застосунку | Залишити окремо: незалежні правила; validation і projection одного response лишаються в одному mapper                                                                   | Public exports через `data-access/src/index.ts`          | `npx nx test admin-references-data-access`                           |
| `feature/src/hooks/use-fabrics.ts`, `use-fabric-editor.ts`, `use-fabric-deletion.ts`, `model/fabric-validation.ts` | Read state, editor, deletion та чиста валідація                 | Залишити окремо за життєвими циклами; supplier lookup повторно використовує `use-suppliers.ts`, власної supplier-моделі немає                                           | Hooks імпортують data-access через public alias          | `npx nx test admin-references-feature`                               |
| `feature/src/components/fabrics/`                                                                                  | Grid, форма, підтвердження                                      | Залишити три компоненти: кожен обслуговує окрему взаємодію; `fabric-dialog.tsx` лише прив'язує `use-fabric-editor.ts` до форми, HTTP у hook; додатковий шар не потрібен | Компоненти не імпортують generated DTO або router        | `npx nx test admin-references-feature`                               |
| `feature/src/pages/garment-accessories-page.tsx`, `garment-accessories-content.tsx`, `fabrics-page.tsx`            | Спільні вкладки та два незалежні CRUD-вмісти                    | Розділено: page тепер володіє лише вкладками, окремі файли володіють діями кожної таблиці; перемикання розмонтовує попередній read                                      | Один route і один public export `GarmentAccessoriesPage` | `npx nx test admin-references-feature`, `npx nx e2e admin-react-e2e` |
| `apps/admin-react/src/app/router/` та `apps/admin-react-e2e/src/`                                                  | Route, пункт меню та browser journey                            | Залишити чинний маршрут і один пункт меню; тести поряд із власниками app та E2E                                                                                         | Жодного другого URL або нової залежності бібліотек       | `npx nx test admin-react`, `npx nx e2e admin-react-e2e`              |

Після перенесення компонентний тест масового видалення один раз не дочекався закриття MUI Dialog: сторінка лишалася `aria-hidden`, хоча лічильник уже став `1`. Тест тепер очікує закриття діалогу перед перевіркою кнопки; продуктивну логіку видалення не змінено. Повторний suite пройшов 17/17.

## Повторна перевірка після розділення

- `npx nx test admin-references-feature` — 17/17; `npx nx lint admin-references-feature`, `npx nx typecheck admin-references-feature`, `npx nx typecheck-tests admin-references-feature` — успішно.
- `npx nx test admin-references-data-access` — 14/14 (Nx cache для незміненого проєкту); lint і typecheck — успішно.
- `npx nx test admin-react` — 12/12; lint і typecheck — успішно. `admin-react-e2e` lint і typecheck — успішно.
- `npm run contracts:check`, lint і typecheck `admin-api-contract` — успішно; `npm run docs:check` і Prettier check feature-документів — успішно.
- `npx nx build admin-react` — успішно; `npx nx e2e admin-react-e2e` — 11/11.

Залишкові межі: browser E2E працює з mock API, тому живу інтеграцію слід перевірити окремо. Vite повідомляє про chunk понад 500 kB; аудит не змінював загальну стратегію розбиття bundle.
