# Клієнтський frontend — виконання 2026-10-26

## Реалізовано

FE-EN-001/002, FE-001/002 у межах клієнтів/контактів. Наявний clients menu ID отримав `/crm/clients`, ліниві list/new/detail routes. Model/data-access/ui/feature мають окремі Nx projects/public aliases/tags. API DTO генеруються, runtime валідатори відсікають неправильні types/kinds/IDs/revisions, mapper зберігає server pagination. Actor/owner не задаються довіреним полем браузера.

Форми створення/редагування/деактивації, різні канали контакту, один primary, ручна перевірка схожих без автозлиття, Admin-only merge capability, requestId replay, root revision conflicts, dirty reload/navigation guard. Клієнтський master не містить цін/формул/постачальників. При new create сервер задає active=true; деактивація доступна в наявній картці.

## Contract provenance

Backend repository `Weretik/BreviERP`, commit `bb0a9a710892a7dd25acad99def291c53ccf6da9`, canonical CRM source `docs/sdd/contracts/crm/clients-quotes.openapi.yaml`. Sync із чистого локального checkout, generate/check пройдено. Раніше source pin 0529... не містив CRM і не використовувався як доказ. Власну давню правку backend індексу не прибрано заради clean-tree gate. Жодного push або ручного редагування generated types.

## Автоматичні результати

- `vitest run --config libs/admin/clients/model/vitest.config.mts`: 2 passed, обов'язкова назва без нав'язування реквізитів особі, телефон/email validation.
- `vitest run --config libs/admin/clients/data-access/vitest.config.mts`: 4 passed: pagedInfo total, invalid DTO/capabilities/channel rejection, локальний HTTP server перевіряє canonical body/requestId/revision і точну cache invalidation без refetch іншої картки.
- `vitest run --config libs/admin/clients/feature/vitest.config.mts --reporter=verbose`: 10 passed: loading/empty/forbidden, URL search reset page, 409 input retention/dirty refresh confirmation, stale previous-record isolation, explicit dirty exit, contact deactivation/primary/revision and invalid email rejection, stable requestId per intent.
- Scoped `eslint libs/admin/clients` та змінені router files: passed після оновлення Nx graph для нових library roots; архітектурні правила не послаблювалися. Початковий старий graph помилково вважав нові libraries одним project; `nx show project admin-clients-feature --json` підтвердив правильні roots/tags/targets після перебудови.
- Feature lib/spec typechecks, data-access lib/spec та Admin app route composition typecheck: passed. Фактичні targets у project.json, жодного вигаданого test runner. UI тестується через feature, порожній UI runner прибрано.
- Scoped Prettier для нових client files і router; documentation checks recorded after final update.

## Red → Green та scoped audit

- AF-FE-001, correctness, verified: первинний interaction Red довів refresh dirty-форми без підтвердження (refetch уже викликався). Тепер окремий confirm dialog, відмова зберігає введення; Green/Regression passed. MUI transition закриття діалогу очікується асинхронно у тесті.
- AF-FE-002, privacy/correctness, verified: перехід між query args не показує попереднього клієнта через `data`; використано currentData, dedicated pending-record test passed.
- AF-FE-003, state boundary, verified: scoped HTTP/cache test доводить refresh root/list та відсутність refetch чужої відкритої картки.
- AF-FE-004, responsibilities, verified: окремі models/validation, generated DTO boundary, mappers/cache, presentation та scenario orchestration. Немає deep imports, ручного generated DTO або HTTP/formulas у feature/UI/model. Generated openapi.ts є tooling output і не ділиться вручну.

## Межі результату

Історичний імпорт клієнтів не виконувався; локально застосовано тільки аддитивну CRM schema через backend job. Quote/customer snapshot invariants, quote-based sharing, custom sewing, documents/sends та архів — наступні фази SDD. Ручний браузерний/візуальний огляд, E2E, production build і full suite не запускалися: за правилами проєкту вони не входять до цієї автоматичної перевірки. Ручне приймання користувача — окремий результат, не позначено виконаним.

## Завершальна перевірка документації

`npm run docs:check`: 490 Markdown files passed, no broken links/empty files/duplicates. Scoped feature lib/spec typecheck, Admin app typecheck, final client/router ESLint and git diff --check passed. Backend/Frontend feature links and UTF-8 content checked separately; no local runtime/browser acceptance was inferred.
