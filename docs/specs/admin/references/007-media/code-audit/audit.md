# Аудит відповідальностей коду — Медіа/Фото

- **Feature:** `docs/specs/admin/references/007-media/`
- **Scope:** уся реалізована feature
- **Дата:** 2026-09-29

Аудит повторно проведено після реалізації за
`docs/specs/_templates/code-audit/`. Переглянуто весь код у scope, включно з
повторно використаними product media flows, а не лише останній diff.

## Перед реалізацією

- [x] Переглянуто router/menu, shell navigation, React reference pages,
      product media transport/model/mapper/upload UI, public exports, OpenAPI,
      Nx targets і наявні тести.
- [x] Визначено власників: backend OpenAPI — контракт; products data access —
      transport/runtime mapping; products feature — правила стану й UI; app
      router — route/menu; Playwright — browser journey.
- [x] У `design/frontend.md` записано точні шляхи, змішані ролі та заплановані
      межі змін.

## Після реалізації

- [x] Повторно переглянуто всі нові й повторно використані файли, imports,
      public API, tests і generated boundary.
- [x] Незалежні ролі розділено між transport, mapper, shared response guards,
      feature rules, lifecycle hooks, presentation components і page composition.
- [x] Перевірено напрям імпортів: API → mapper/HTTP/model; feature → public
      data access; app → public feature export. Зворотних або циклічних імпортів немає.
- [x] HTTP відсутній у page/components; transport DTO і `storageKey` не виходять
      за data access; read/upload/delete state мають окремих власників.
- [x] Невеликі цілісні hooks і components залишено окремими лише за поведінковою
      роллю, а не через кількість рядків.
- [x] File validation повторно використовується standalone media page і
      product photo upload, які викликають один endpoint.
- [x] Після структурних змін повторено focused tests, affected suites, lint,
      typecheck, contract check, app build і critical E2E.

## Результат аудиту

| Шлях або область                                                 | Наявна й впроваджена відповідальність                                        | Рішення та причина                                                                                                         | Межі імпортів                                                                        | Перевірка                                     |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------- |
| `data-access/src/response-validation.ts`                         | Перевірка object/finite number для runtime mappers                           | Виділено, бо однакові transport guards потрібні product і media mappers; файл не є public API                              | імпортується лише внутрішніми mappers                                                | typecheck, lint, data suite                   |
| `data-access/src/catalog-media.mapper.ts`                        | Runtime mapping media list у безпечну `ProductMedia` UI model                | Відділено від 200-рядкового product mapper: інший API payload і окремий error contract                                     | mapper → internal guards/model; не експортується з barrel                            | focused 3/3, suite 14/14                      |
| `data-access/src/catalog-media.api.ts`                           | GET/POST/DELETE `/api/catalog/media`, multipart і upload response validation | Відділено від category lookup, бо media lifecycle є незалежним endpoint owner із трьома operations                         | API → media mapper/shared HTTP/model/generated type; public через data-access barrel | focused 3/3, contract check                   |
| `data-access/src/product-lookups.api.ts`                         | Лише product categories lookup                                               | Залишено малим і цілісним; media transport вилучено через незалежну відповідальність                                       | API → product mapper/shared HTTP/model                                               | data suite 14/14                              |
| `data-access/src/products.mapper.ts`, `products.model.ts`        | Product/category mapping і спільна `ProductMedia` domain model               | Product mapper лишено разом; `ProductMedia` лишено спільною моделлю для product form і media page                          | mapper → internal guards/model                                                       | data suite, typecheck                         |
| `feature/src/model/media-search.ts`                              | Локальний case-insensitive filename search                                   | Перенесено з data access, бо це синхронне правило представлення без transport responsibility                               | feature model → public `ProductMedia` type                                           | page search scenario 4/4                      |
| `feature/src/model/media-file-validation.ts`                     | MIME, empty і 50 MiB client validation                                       | Залишено одним pure rule owner і повторно використано обома upload flows                                                   | hooks/components → feature model                                                     | page upload scenario; focused product E2E 1/1 |
| `feature/src/hooks/use-media-library.ts`                         | Read/retry/abort, loading/error і last successful list                       | Залишено окремо від mutations через незалежний lifecycle                                                                   | hook → public data-access API                                                        | page component 4/4                            |
| `feature/src/hooks/use-media-upload.ts`, `use-media-deletion.ts` | Окремі mutation state machines та outcomes                                   | Залишено двома hooks: різні pending/error/target semantics; спільний абстрактний mutation hook додав би непрозорі branches | hooks → public data-access API і validation                                          | page component 4/4                            |
| `feature/src/components/media/`                                  | Gallery/preview fallback, upload input, delete dialog                        | Presentational roles розділено; компоненти не знають про HTTP або routing                                                  | components → MUI і public model types                                                | component suite, lint                         |
| `feature/src/pages/media-page.tsx`                               | Композиція hooks/components, search query, success message і focus target    | Залишено page orchestrator; бізнесові transport/validation details винесені                                                | page → local hooks/components/models                                                 | component 4/4, feature suite 21/21            |
| `feature/src/components/product-photo-upload.tsx`                | Product-form upload і Ready polling                                          | Не об'єднано зі standalone upload через різний workflow; підключено спільну file validation                                | component → public data access + feature validation                                  | feature suite 21/21, build                    |
| `apps/admin-react/src/app/router/`                               | Route registration і menu item                                               | Залишено у чинних app owners; app імпортує тільки lazy public `MediaPage`                                                  | app → `@admin/products/feature`                                                      | app suite 17/17                               |
| `apps/admin-react-e2e/src/media.spec.ts`                         | Critical browser journey та responsive/theme coverage                        | Залишено окремим feature spec; component edge cases не дублюються                                                          | browser → public UI/API mocks                                                        | Playwright 2/2                                |
| Backend OpenAPI → `docs/contracts/openapi/` → generated types    | Канонічний contract, provenance і generated boundary                         | Snapshot/generated файли отримано contract scripts; ручних змін після sync немає                                           | generated types використовує тільки data access                                      | `contracts:check` passed                      |

## Повторні перевірки

- `npx nx test admin-products-data-access` — 14/14.
- `npx nx test admin-products-feature -- --pool=threads --maxWorkers=2` — 21/21.
- `npx nx test admin-react -- --pool=threads --maxWorkers=2` — 17/17.
- `npx nx run-many -t lint ...` — 4/4 affected projects.
- `npx nx run-many -t typecheck,typecheck-tests ...` — 6/6 available targets.
- `npx playwright test src/media.spec.ts --workers=1` — 2/2.
- `npx playwright test src/products.spec.ts --grep "only Ready photos"` — 1/1.
- `npm run contracts:check` і `npm run docs:check` — passed.
- `npx nx build admin-react` — passed; app-level chunk-size warning лишився.

## Залишкові ризики

- React Admin не має shared auth/session boundary; backend media endpoints досі
  `AllowAnonymous`. Локальну media-only authorization модель не створено.
- GET media непагінований; server pagination/search потрібні при суттєвому
  зростанні медіатеки.
- Загальний bundle перевищує Vite warning threshold; media lazy chunk становить
  близько 11.69 kB і не є джерелом основного 859.22 kB chunk.
