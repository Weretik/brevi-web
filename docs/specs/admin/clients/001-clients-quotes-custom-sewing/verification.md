# Перевірка та приймання

Клієнти, P2 і P3 мають локальні автоматичні докази; [FE-005 evidence](evidence/fe-005-2026-10-28.md) фіксує 108 passing scoped tests. Custom/document/import planned; ручне/deployed приймання pending. Дотримуватися [правил тестування](../../../../standards/shared/testing-rules.md) та [контрактного workflow](../../../../architecture/api/contract-workflow.md); обирати мінімальні перевірки змінених сценаріїв.

## Обов'язкові докази реалізації

| Рівень                      | Що довести                                                                                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| model / mapper              | Перетворення DTO, три видимі/недоступні рівні без zero fallback, typed kind, runtime rejection, відсутність формули UI                               |
| Компоненти                  | Loading/empty/error/forbidden, validation/save/conflict, зміна primary contact, reason СІЗ, явне reprice/visibility, dirty guard, файл missing/retry |
| data-access                 | operationId із pinned SHA, page metadata, cancellation/cache invalidation, 409/422 mapping, requestId replay без дубля                               |
| Архітектура                 | Public aliases/теги/межі, feature без HTTP, model без React/DTO, один primary responsibility/file; scoped code audit і виправлені findings           |
| Інтеграція/critical journey | Наявний пункт Clients → клієнт → КП → варіанти → custom version → ready/PDF → явний test send; backend того самого SHA                               |
| Ручна перевірка             | Вузький/широкий екран, клавіатура/focus/українські назви, multipage PDF і приватні sentinel дані відсутні, невизначений стан delivery                |
| Історичне перенесення       | Статуси imported/alreadyMapped/review/excluded/invalid, missing file/partial graph не маскуються; report має manifest/time/hash provenance           |

Для нової взаємодії: фокусний Red тест відсутньої поведінки → Green → Refactor → Regression із реальним test name/командою/результатом. Відсутній test target — FE-EN-001, не привід видати ручний огляд за автоматичний тест. Документація перевіряється посиланнями/форматом/diff, без штучних поведінкових тестів.

Додаткове first-contact приймання SC-I01–03: три формати/4–8 слотів, правильний сезон/featured mapping/одна тканина, owned Manager templates, ціна нового apply vs immutable PDF, rendered seasonal layout і pinned explicit send.

## Послідовність інструментів при реалізації

Спочатку перевірити доступні `project.json`/`npx nx show project <name> --json`. Наявні scripts: `npm run contracts:sync -- <clean-backend-checkout> <full-SHA>`, `npm run contracts:generate`, `npm run contracts:check`. Після створення реальних проєктів обрати їхні наявні lint/typecheck/test targets; не вигадувати ім'я `admin-crm-test`. Scoped форматування: наявний Prettier, range `~3.9.6`; для нових SDD — лише ці Markdown-файли. `npm run docs:check` існує, результат відокремити від інших старих документаційних помилок.

## Приймальні кроки

1. Відкрити старий пункт «Клієнти», створити організацію/особу/контакт, перевірити пошук/primary/деактивацію. Admin merge, Manager/User scope і guessed IDs перевірити різними сесіями.
2. Створити КП, додати Article/PPE/разові СІЗ, два варіанти й три ціни; reorder/visibility/приватні поля зберігаються після reload. 724/931 не обходять blocker.
3. Оновити тестовий input cost на backend: V1 і text-only edit зберігають ціну; явне reprice з diff створює V2. Одночасний save дає керований conflict; copy/transfer/archive не псують історію.
4. Два варіанти custom fabric, нанесення/доставка/пакування, private/production файли, шаблон/підказка. Серверні суми збігаються з golden fixtures; quoted custom V1 не змінюється після V2.
5. Без реквізитів draft зберігається, ready заблоковано. З verified issuer/tax/numbering PDF містить лише вибрані public дані; після зміни live master повторне скачування має той самий hash.
6. Надіслати лише явно на тестову адресу: queued ≠ sent, failed/unknown пояснені, повтор того ж requestId не дублює. Production package має version/hash без обіцянки інтеграції Цеху.
7. Звірити імпортний report: неповні графи/байти видимі, mixed counterparties не стали всі клієнтами, repeated import не дублює. Backend має recovery rehearsal evidence.

У task evidence записати browser/runtime, контрактний SHA, команди/сценарії, скріншоти лише де вони допомагають, невиконані перевірки й реальний вплив. Ручне приймання користувача фіксується окремо; написаний SDD не означає згоду з неперевіреним production результатом.

## Commit/push handoff — 2026-10-30

User explicitly authorized committing all accumulated Brevi work and pushing both repositories. Applied git-workflow:commit-batching. Frontend groups: contract snapshot/generated types/checker; shared role/blob capability; coupled CRM models/data/UI/feature/navigation; public legal pages; documentation. The CRM group intentionally keeps expanded discriminated models, mappers, public exports and their consumers together rather than leaving incompatible intermediate states.

Fresh scoped checks before handoff:

- contracts:check: canonical snapshot and generated types match backend 3ad90271721bc58b61fa1efa11ae6c2cd87e9866; three operation-checker tests passed.
- node --test tools/legal/erp-public-pages.test.mjs: four public-document checks passed.
- npx vitest run --config libs/admin/clients/model/vitest.config.mts: 16 files / 48 tests passed.
- npx vitest run --config libs/admin/clients/data-access/vitest.config.mts: 19 files / 110 tests passed.
- npx vitest run --config libs/admin/clients/ui/vitest.config.mts: one file / three tests passed.
- npx tsc --noEmit -p libs/admin/clients/feature/tsconfig.spec.json: passed.
- Initial concurrent feature run: 147 passed, two editor failures (one timeout, one dialog visibility wait). Isolated editor file: all seven passed. Repeated complete changed feature project with --maxWorkers=2: 38 files / 149 tests passed. No code/test behavior changed to obtain these results.
- Initial routing regression (app-router, admin-route-layout, navigation-config): 13 passed, three async loading/timeout failures. Focused retry results are recorded below; do not describe the initial command as green.
- npm run docs:check after incoming documentation merge: 523 files passed; git diff --check passed (line-ending notices only).
- Normal repository pre-commit hooks ran formatting and ESLint on their configured staged file patterns; hooks were not skipped. Typical credential-pattern scan of outgoing/new files found no matching secrets; local ignored environment/secrets were not staged.

Existing immutable backend commits were preserved. Incoming GitHub documentation was merged without force push or rewritten history. Backend master was pushed and independently matched origin at c0520b86550edbd21fcc713a1d1865e63e28b4fc. Frontend origin verification follows push.

No full application suite, production build, browser/E2E, real OAuth consent or email send was performed for this Git handoff. Git push does not establish that public policies are deployed or Google approval is complete. FE-EN-003 publication, operator confirmation and send-only runtime/helper revision remain open.

Routing focused retry: npx vitest run --config apps/admin-react/vitest.config.mts app-router.integration with filter opens suppliers / opens the product list / opens media, --maxWorkers=1 --testTimeout=30000: all three selected tests passed; seven other cases skipped by filter. Together with the first routing run, all 16 selected routing/navigation cases have passing observations. The longer timeout applies only to this command; repository tests and product behavior were unchanged.
