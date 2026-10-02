# Auth, permissions і API foundation — проєктування frontend

## Наявний контекст

- Перевірені застосунки та бібліотеки: `apps/admin-react`,
  `libs/admin/core/shell`, `libs/admin/shared/{api-client,config,contracts}`,
  `libs/admin/{products,references}/{data-access,feature}`.
- Source reference: п'ять paths у `D:\RiderProjects\kedr-web`, перелічених у
  `USAGE.md`; `core/permissions` містить лише `.babelrc`.
- Наявний шлях даних: app `AdminApiProvider` → один `adminApi` → domain
  `injectEndpoints` → `fetchBaseQuery` → `apiUrl`.
- Наявні тести: executable Vitest targets для shared libraries, shell,
  products/references data-access/features; app integration tests і Playwright
  project. Фактичні targets перевіряються через `nx show project` перед роботою.
- Package manager/tooling: `npm@11.6.2`, Node 24, Axios, RTK Query,
  React Redux, Vitest, React Testing Library і Playwright уже присутні.

## Архітектурний baseline

| Перевірка                                | Фактичний стан                                                                                                               | Вимога й джерело                                              | Розбіжність  | Задача                 |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------ | ---------------------- |
| Nx projects, tags і dependency direction | shell/config/api-client мають projects/targets; auth/permissions відсутні                                                    | `docs/architecture/admin/nx-contract.md`, `eslint.config.cjs` | так          | TS-003, TS-004         |
| Domain layers і вкладеність              | target shared projects існують; api-client/config плоскі у `src/lib`; shell provider відсутній                               | `docs/architecture/admin/domains.md`, `state-and-api.md`      | так          | TS-001, TS-002, TS-004 |
| Public entry points та imports           | aliases для config/api-client/shell є; auth/permissions aliases відсутні; багато consumers залежать від current public names | `docs/architecture/admin/nx-contract.md`                      | так          | TS-002–TS-005          |
| State/data stack                         | один RTK Query API + `fetchBaseQuery`; accepted ADR вимагає Axios base query/auth adapter                                    | `docs/architecture/admin/state-and-api.md`, ADR-0001          | так          | TS-002, TS-003         |
| DTO boundary                             | generated shared contracts є, але auth operations відсутні                                                                   | `docs/architecture/api/contract-workflow.md`                  | так, blocker | EN-001                 |
| Test tooling і targets                   | current projects мають lint/typecheck/typecheck-tests/test; new auth/permissions projects не існують                         | `docs/standards/testing-rules.md`                             | так          | TS-003, TS-005         |

Попередня remediation SDD
`docs/specs/admin/architecture/001-admin-layers-and-boundaries/` завершена, але
фактичний shared foundation є проміжним fetch-based implementation. Ця feature
є окремим погодженим transition до вже прийнятого ADR-0001.

## Відповідальності в межах роботи

| Область                        | Відповідальність і точні шляхи                                                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Спільна поведінка              | transport contracts/error normalization у `libs/admin/shared/api-client/src/{contracts,errors}`; config parsing у `libs/admin/shared/config/src/{env,config}`             |
| Стан і отримання даних         | canonical RTK Query API/store у `shared/api-client`; in-memory token/session lifecycle у `core/auth/src/session`                                                          |
| Інтерфейс React Web            | без нового screen; app composition у `apps/admin-react/src/app/providers` і shell logout context у `core/shell/src/providers`                                             |
| Навігація та глибокі посилання | route guards лише після EN-002; не додавати до ready auth transport scope                                                                                                 |
| Браузерні адаптери та дозволи  | CSRF cookie reader в auth transport; жодного local/session storage для token                                                                                              |
| Інтеграція з API               | generated auth operations після EN-001; Axios instance/interceptors/base query; current domain endpoint compatibility                                                     |
| Перевірка                      | pure config/error unit tests, auth/interceptor/RTK integration tests, shell provider component test, affected domain regression, app build; permission tests після EN-002 |

## Дозволені інструменти та заборонені обходи

- Server state/data access: один RTK Query API у `@admin/shared/api-client`;
  domain data-access використовує лише `injectEndpoints`.
- Transport boundary: один Axios instance, cancellation signal, normalized
  `ApiError`, `AuthSessionAdapter`, один refresh promise і bounded retry.
- Заборонено: direct Axios/fetch у feature/component, другий Redux store/API,
  token у persistent storage, ручні auth DTO, deep imports, raw error body,
  вигадані permission names, копіювання `kedr` branding/defaults.
- Evidence пошуку reuse: `rg` по aliases/consumers показав current
  `AdminApiProvider`, `adminApi`, `toAdminApiError`, `configureApiEnvironment`
  у app/products/references; їхні contracts треба мігрувати сумісно.

## Цільова інтеграція

```text
apps/admin-react composition
  ├─ appConfig (@admin/shared/config)
  ├─ initializeAdminAuth (@admin/core/auth)
  ├─ AdminApiProvider (one store/baseApi)
  └─ AdminShellSessionProvider(onLogout)

domain data-access -> public baseApi/adminApi compatibility -> Axios baseQuery
  -> one Axios client -> auth/logging/refresh interceptors
  -> AuthSessionAdapter owned by core/auth
```

### Сумісність current consumers

- `adminApi` та поточні tag types не зникають одним rename. Реалізація або
  зберігає сумісний public alias до canonical `baseApi`, або атомарно змінює всі
  products/references consumers і tests у TS-002.
- Current `toAdminApiError`, `isAdminApiError`, `adminApiErrorMessage` semantics
  лишаються доступними feature-коду, доки всі consumers не переведені на
  стабільний `ApiError`. Не допускаються два незалежні error formats.
- `AdminApiProvider`, store reset і test helpers зберігають один store та один
  reducer path `adminApi`.
- Current environment files лишаються input app composition; перехід на прямий
  `import.meta.env` не повинен обійти repository environment strategy. TS-001
  має обрати один adapter і видалити другий лише після міграції всіх consumers.

## Початковий аудит відповідальностей

| Файл/модуль                                       | Наявні ролі та залежності                             | Рішення                                                              | Цільові paths/owner                                                           |
| ------------------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `shared/api-client/src/lib/admin-api.ts`          | fetch transport, RTK API, error parsing, tags         | split; preserve public behavior                                      | `client/`, `contracts/`, `errors/`, `interceptors/`, `rtk-query/`, `runtime/` |
| `shared/api-client/src/lib/admin-api-provider.ts` | store creation/provider/reset                         | keep responsibility, move/name only if public API remains stable     | `rtk-query/` or dedicated provider module                                     |
| `shared/config/src/lib/api-environment.ts`        | mutable environment and URL composition               | split/adapt to typed Brevi config; keep deterministic test injection | `env/`, `config/`                                                             |
| `core/auth` source                                | token state, raw session transport, API-client wiring | adapt; generated Brevi contracts and tests required                  | `libs/admin/core/auth/src/session/`                                           |
| `core/shell/src/providers/...` source             | logout dependency injection                           | adapt and test; shell must not own auth implementation               | same path in Brevi shell                                                      |
| `core/permissions` source                         | only `.babelrc`, no behavior                          | do not copy as empty project                                         | create policy/guard/hook paths only after EN-002                              |
| app providers/main                                | API provider, theme/router, config bootstrap          | extend composition without moving domain logic to app                | existing paths                                                                |

## Рішення та ризики

- Source project files/configs не копіюються дослівно: Brevi project targets,
  tags, test naming, aliases і UTF-8 conventions мають пріоритет.
- Auth є elevated security scope; implementation blocked до versioned contract.
- Зміна base query впливає на всі Admin API resources. Characterization tests
  products/references виконуються до й після TS-002.
- Source використовує legacy cookie name `kedr.csrf`, який поточний integration
  doc теж описує як legacy runtime contract. Значення не перейменовується без
  backend contract; воно не є сигналом копіювати інший branding у UI/config.
- `[NEEDS CLARIFICATION]`: які permission identifiers повертає backend, де вони
  містяться (`/me` або token claims), і який route/action є першим consumer.
