# Auth, permissions і API foundation — правила та приймальні сценарії

## Мета та межі

- **Актор:** адміністратор Brevi та frontend-модулі React Admin.
- **Мета:** React Admin має одну конфігураційну, транспортну й session boundary,
  яка безпечно відновлює/завершує сесію та не ламає чинні API-сценарії.
- **У межах:** адаптація `core/auth`, фактичної permissions capability після
  погодження правил, shell logout provider, `shared/api-client`, `shared/config`,
  app composition, aliases, Nx targets і focused tests.
- **Поза межами:** login page, зміна дизайну shell, backend-реалізація auth,
  нові domain endpoints, Angular Storefront, deployment/secrets, масове
  переписування products/references та довільна рольова модель.

## Бізнес-правила

- **R-001:** Runtime config має єдиного власника й використовує Brevi values та
  fallback-и; consumer не читає Vite environment напряму.
- **R-002:** Access token зберігається лише в пам'яті; refresh cookie лишається
  HTTP-only, а CSRF cookie використовується лише для refresh contract.
- **R-003:** Authenticated request отримує Bearer token; паралельні `401`
  використовують один refresh, кожен request повторюється не більше одного разу,
  а session endpoints не запускають рекурсивний refresh.
- **R-004:** Невдале відновлення або refresh переводить frontend у
  unauthenticated state без нескінченного retry та без показу захищеного успіху.
- **R-005:** Logout викликає погоджену операцію, очищає in-memory session і
  server cache навіть коли transport logout завершується помилкою.
- **R-006:** Transport errors нормалізуються у безпечний публічний контракт;
  UI не отримує raw body, headers, token або stack trace.
- **R-007:** Після міграції чинні products/references queries, mutations, tags,
  cancellation, normalized messages і `AdminApiProvider` behavior зберігаються.
- **R-008:** HTTP-логи вимкнені за замовчуванням і не містять headers, cookies,
  token чи body.
- **R-009:** Permissions library створюється лише разом із погодженими inputs,
  policy semantics і хоча б одним реальним consumer; frontend guard не
  вважається backend authorization boundary.

## Приймальні сценарії

### SC-001 — Відновлення сесії під час запуску

**Охоплює:** R-001, R-002, R-004

- **За умови** у браузері є чинна refresh session
- **Коли** адміністратор відкриває React Admin
- **Тоді** сесія відновлюється до виконання захищених запитів без збереження
  access token у persistent browser storage

### SC-002 — Авторизований API-запит

**Охоплює:** R-002, R-003, R-007

- **За умови** сесія успішно відновлена
- **Коли** Admin завантажує або змінює доменні дані
- **Тоді** запит проходить через єдину transport boundary з Bearer token, а
  чинна поведінка даних і кешу не змінюється

### SC-003 — Одноразове поновлення після завершення access token

**Охоплює:** R-003, R-004

- **За умови** кілька запитів одночасно отримали `401` через завершений access token
- **Коли** frontend поновлює сесію
- **Тоді** виконується один refresh, запити повторюються щонайбільше один раз,
  а цикл повторного refresh не виникає

### SC-004 — Втрата сесії

**Охоплює:** R-004, R-006

- **За умови** refresh session відсутня, недійсна або завершена
- **Коли** запуск чи повторний запит не може отримати новий access token
- **Тоді** frontend очищає session state, не показує хибний успіх і повертає
  безпечний unauthenticated result

### SC-005 — Завершення сесії

**Охоплює:** R-005

- **За умови** адміністратор має активну сесію
- **Коли** він виконує logout через shell action
- **Тоді** frontend завершує server session, очищає локальну сесію й API cache
  незалежно від результату мережевого виклику

### SC-006 — Безпечна нормалізація помилки

**Охоплює:** R-006, R-008

- **За умови** API повернув validation, authentication, authorization, network
  або server error
- **Коли** помилка доходить до Admin feature
- **Тоді** feature отримує стабільний безпечний тип і чинне зрозуміле
  повідомлення без витоку чутливих transport details

### SC-007 — Збереження чинних API-сценаріїв

**Охоплює:** R-007

- **За умови** products і references використовують наявні endpoints та cache tags
- **Коли** транспорт і config адаптовано
- **Тоді** їхні чинні component/integration сценарії проходять без зміни UI behavior

### SC-008 — Перевірка дозволу

**Охоплює:** R-009

- **За умови** backend contract надає погоджений набір permission inputs, а
  конкретна дія або route має визначену policy
- **Коли** authenticated адміністратор відкриває дію або route
- **Тоді** frontend послідовно дозволяє або приховує/блокує її, а backend
  окремо перевіряє той самий доступ

SC-008 відкладено в окрему майбутню feature за рішенням власника від
2026-10-02. Назви ролей, claims і перший consumer не виводяться з порожнього
каталогу `kedr-web/core/permissions`; ця delivery приймається за SC-001–SC-007.

## Security review: elevated

| Asset                  | Actor/entry point           | Загроза                        | Server mitigation                                      | Frontend behavior                                   | Verification                           |
| ---------------------- | --------------------------- | ------------------------------ | ------------------------------------------------------ | --------------------------------------------------- | -------------------------------------- |
| Access/refresh session | browser, Axios interceptors | витік або persistent token     | short-lived access token, HTTP-only refresh cookie     | token лише в пам'яті; жодних token logs/storage     | source search + auth integration tests |
| CSRF refresh           | refresh endpoint            | cross-site refresh misuse      | CSRF cookie/header validation                          | exact cookie-to-header mapping; credentials enabled | contract + focused transport test      |
| Protected operations   | Admin routes/actions        | UI bypass або stale permission | backend authentication/authorization on every endpoint | guard лише UX; 401/403 fail closed                  | contract tests + permission tests      |
| Error/log data         | error mapper/logger         | витік headers/body/PII         | sanitized server errors                                | method/sanitized URL/status/duration only           | unit tests + source review             |
