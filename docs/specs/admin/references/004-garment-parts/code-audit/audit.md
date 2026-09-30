# Аудит відповідальностей коду — Елементи виробу

- **Feature:** `docs/specs/admin/references/004-garment-parts`
- **Scope:** уся feature
- **Дата:** 2026-09-28

## Перед реалізацією

- [x] Переглянуто Angular controller/модель/форму, наявні React reference libraries, їхні public exports, hooks, компоненти, маршрути й тести.
- [x] API та runtime mapping належать `data-access`; завантаження і дії — hooks; таблиця й діалоги — components; route і меню — app router.
- [x] У `design/frontend.md` визначено шляхи й межі. Наявні reference libraries вже реалізують ці ролі, тому нові Nx libraries не потрібні.

## Після реалізації, до delivery checkpoint

- [x] Повторно переглянуто всі файли feature: OpenAPI boundary, модель, mapper, transport, error mapping, read/editor/deletion/selection hooks, validation, grid, dialog, page, route, public exports і тести. Звірено використаний Angular source та API-контракт.
- [x] Вибір MUI Data Grid винесено з deletion hook у `use-garment-part-selection.ts`. Видалення тепер отримує callback для узгодження вибору після часткової невдачі, без залежності від MUI. Результат дії має явну `severity`; page не виводить її з тексту повідомлення.
- [x] Generated operation types імпортує лише data-access; feature імпортує public API data-access; app імпортує public API feature. Циклів імпорту, дублювання стану й HTTP-викликів у компонентах немає.
- [x] Після розділення повторено focused tests, relevant regression, lint, typecheck, build і E2E. Команди та результати наведено нижче.

## Результат аудиту

| Шлях або область                                                                                         | Наявна й впроваджена відповідальність                               | Рішення та причина                                                                                               | Нові шляхи й межі імпортів                                                      | Перевірка                                             |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `libs/admin/references/data-access/src/garment-parts/garment-parts.model.ts`, `garment-parts.mapper.ts`  | Модель рядка й runtime-перевірка відповіді                          | Залишено окремо: модель не залежить від HTTP, mapper знає generated response type                                | Mapper → model і `@admin/api-contract`                                          | Data-access 19/19 (Nx cache), lint/typecheck успішно  |
| `libs/admin/references/data-access/src/garment-parts/garment-parts.api.ts`, `garment-parts.error.ts`     | Transport чотирьох operationId і нормалізація помилок               | Залишено окремо: error parsing використовує transport, UI не бачить raw response                                 | API → mapper/error; public exports через `data-access/src/index.ts`             | Data-access 19/19 (Nx cache), lint/typecheck успішно  |
| `libs/admin/references/feature/src/hooks/use-garment-parts.ts`                                           | Завантаження, стан списку, retry, cancellation і reload після write | Залишено разом: це один життєвий цикл списку; persistent cache немає                                             | Hook → public data-access                                                       | Focused component 5/5, feature 22/22                  |
| `libs/admin/references/feature/src/hooks/use-garment-part-editor.ts`, `model/garment-part-validation.ts` | Стан форми, виклик write, локальна перевірка полів                  | Залишено окремо: чисту валідацію можна викликати без React, editor керує однією формою                           | Editor → validation і public data-access                                        | Focused component 5/5, feature 22/22                  |
| `libs/admin/references/feature/src/hooks/use-garment-part-deletion.ts`, `use-garment-part-selection.ts`  | Асинхронне видалення й модель вибору MUI                            | Розділено: вибір і reconciliation належать grid state; deletion керує підтвердженою операцією та partial failure | Deletion → public data-access; selection → MUI type; page компонує обидва hooks | Focused component 5/5, feature 22/22 після розділення |
| `libs/admin/references/feature/src/components/garment-parts/`                                            | Grid, edit/view dialog, confirmation dialog                         | Залишено три компоненти: кожен має одну видиму роль, HTTP лишається в hooks/data-access                          | Components → local hooks/types                                                  | Focused component 5/5, feature 22/22                  |
| `libs/admin/references/feature/src/pages/garment-parts-page.tsx`                                         | Компонування вкладки, toolbar, стану дій та діалогів                | Залишено page цілісною; структурований результат прибрав визначення severity за локалізованим текстом            | Page → hooks/components; public export через `feature/src/index.ts`             | Feature 22/22, app 13/13                              |
| `apps/admin-react/src/app/router/` і `apps/admin-react-e2e/src/garment-parts.spec.ts`                    | Route/menu composition та browser acceptance                        | Залишено: route у наявному registry, E2E містить лише три сценарії цієї feature                                  | Router → public feature export                                                  | App 13/13, E2E 3/3, build успішно                     |

## Перевірка після розділення

- `npx nx test admin-references-feature -- garment-parts-page.component.test.tsx` — 5/5.
- `npx nx lint admin-references-feature`, `npx nx typecheck admin-references-feature`, `npx nx typecheck-tests admin-references-feature`, `npx nx test admin-references-feature` — успішно, 22/22.
- `npx nx lint admin-references-data-access`, `npx nx typecheck admin-references-data-access`, `npx nx test admin-references-data-access` — успішно, 19/19; lint і test взято з Nx cache, оскільки код data-access не змінювався під час аудиту.
- `npx nx lint admin-react`, `npx nx typecheck admin-react`, `npx nx typecheck-tests admin-react`, `npx nx test admin-react`, `npx nx build admin-react` — успішно, app tests 13/13. Build повідомив про великий наявний bundle понад 500 kB.
- `npx nx e2e admin-react-e2e --grep 'garment parts'` — 3/3.
