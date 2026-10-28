# Перевірка та приймання

Клієнтський slice має автоматичні докази [виконання](evidence/clients-frontend-2026-10-26.md). Quote/custom/document/import сценарії залишаються planned; ручне приймання не позначено виконаним. Дотримуватися [правил тестування](../../../../standards/shared/testing-rules.md) та [контрактного workflow](../../../../architecture/api/contract-workflow.md). Не запускати повний suite/build без окремої потреби/вказівки; вибрати мінімальні перевірки змінених сценаріїв.

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
