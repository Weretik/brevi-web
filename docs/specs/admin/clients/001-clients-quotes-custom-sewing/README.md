# CRM-001 — Клієнти, комерційні пропозиції та індивідуальне пошиття

**Стан:** P1–P5 локально перевірено в зафіксованих межах приймання. P6 FE-009 delivery/history і production ZIP підключені до backend `3ad90271721bc58b61fa1efa11ae6c2cd87e9866` та автоматично перевірені. [Поточне evidence](evidence/fe-009-delivery-production-2026-10-30.md). Live Google consent/send, template management і решта міграції/фінального приймання залишаються відкритими. **Дата:** 2026-10-30. **Застосунок:** Admin React. **Домен:** `clients`.

## Мета та межі

P3 checkpoint — 2026-10-28: backend TS-005 pinned to `f185138fc1cfc6c71cf94fe4e7103652e6719b5b`; connected FE-005 scenarios implemented locally, 108 scoped tests passed. [FE-005 evidence](evidence/fe-005-2026-10-28.md).

Підключити **наявні** пункти «Клієнти», «Розрахунки та КП», «Архів КП» до одного процесу: клієнт/контакт → позиції й варіанти КП → серверний розрахунок → незмінна версія → PDF → явне надсилання та історія. Не додавати другий пункт клієнтів, дубль довідника товарів або власний рушій ціни у браузері. Операційні дані зберігає PostgreSQL через API Brevi.

Google-таблиця є основою полів і погодженої арифметики; це не вимога відтворити її вкладки як окремі таблиці БД. П'ять вкладок КП перевірено: усі містять лише заголовки, разом 62 поля. Історичні клієнти/КП походять із окремого погодженого експорту БД, а не з вигаданих рядків таблиці.

У межах: список/картка клієнта й контакти, пошук і права, редактор КП з позиціями/варіантами/трьома цінами, СІЗ і разові СІЗ, склад і явний перерахунок, версії/копіювання/передача/архів, приватне індивідуальне пошиття й альтернативи тканин, файли/шаблони/підказки, реквізити продавця, PDF, явне надсилання/історія, звіт перенесення й експорт виробничого пакета.

Поза межами: фінанси/оплати/склад/зарплата, новий процес прийняття замовлень, фактична інтеграція з Цехом, живий обмін KeepinCRM/Gmail, публічний Storefront. Виробничий пакет тут — артефакт закріпленої версії, а не створення виробничого замовлення.

## Навігація SDD

- [Початковий стан та джерела](sources.md)
- [Клієнти](requirements/clients.md), [КП і версії](requirements/quotes.md), [індивідуальне пошиття](requirements/custom-sewing.md), [PDF та надсилання](requirements/documents.md), [перше знайомство](requirements/introductions.md)
- [Архітектура, маршрути й карта файлів](design/frontend.md)
- [API та залежність від backend](contracts/api-contract.md)
- [Поетапна реалізація й атомарні задачі](tasks/implementation-plan.md)
- [Перевірка та критерії приймання](verification.md), [трасування](traceability.md)

Backend-власник: `Weretik/BreviERP`, `docs/sdd/specs/crm/001-clients-quotes-custom-sewing/README.md`. Спільні ID `R-*`/`SC-*` описують ті самі бізнес-сценарії, задачі frontend мають префікс `FE-*`. Схема БД/арифметика/імпортні транзакції визначені backend SDD; тут — поведінка користувача та межа споживача.

## Історичний checkpoint P2

Клієнтські FE-EN-001/002, FE-001/002 та P2 FE-003/004 реалізовано. Поточний snapshot споживає 12 CRM операцій із backend SHA `1c1f51dc7837f3d5e3a0da7326cb17b48d23e4d9`: сім клієнтських і п'ять draft quote operations. Користувач прямо дозволив локальний backend commit без push 2026-10-27; контракт синхронізовано з чистого checkout цієї ревізії. Реквізити/нумерація, поштовий провайдер і повнота архіву — окремі ворота відповідних фаз.

Див. [клієнтські докази](evidence/clients-frontend-2026-10-26.md) і [P2 frontend evidence](evidence/p2-frontend-2026-10-27.md). Чернетка відкриває збережені ціни й recipient snapshot без автоматичного оновлення. P3 історія/явний reprice/copy/transfer/archive мають автоматичні докази FE-005; custom, документи й імпорт залишаються planned. Повне завершення CRM-001 потребує всіх сценаріїв, документів/прав/архіву й окремого ручного приймання. Історичний імпорт не запускався.

## Поточний результат

P1–P4 implemented and automatically verified locally. Current P5 contract/source is `e5f563456efd1b29a67a36805c2b3775ce2f9d06`; FE-008 has automated frontend integration evidence, while manual PDF/privacy acceptance and FE-011/TS-016 completion remain open. [Contract evidence](evidence/fe-en-002-p5-2026-10-29.md), [FE-008 evidence](evidence/fe-008-integration-2026-10-29.md). The earlier phase descriptions below remain historical.

Наявні вкладки «Клієнти» і «Розрахунки та КП» підключені до Crm API. P2 дає список/пошук КП, клієнта/контакт, Catalog Article/PPE та разові СІЗ, серверний preview, позиції/варіанти/три ціни, visibility і текстові правки зі збереженням незмінних версій. Конфлікт не стирає форму; невідомий результат запису уточнюється тим самим payload/requestId. P3 додає історію/порівняння, явний reprice, копіювання версії, передачу та архів/відновлення. За прямою вказівкою користувача ручне приймання виконується в кінці; P4 custom реалізується без очікування на нього. Ця реалізація не активувала міграції/імпорт чи production rollout.

## Структурний аудит

[Аудит клієнтського slice](code-audit/audit.md): розподіл файлів за ролями, scenario hooks та API operations із регресійними перевірками. Обсяг FE-001/002 не розширено; наступні фази залишаються planned.

## Mandatory Gmail publication gate

[FE-EN-003](tasks/readiness/fe-en-003.md) adds public BreviERP description/privacy/terms on https://office.brevi.com.ua, with sender pp.brevi@gmail.com. User selected permanent In production onboarding and send-only/manual review. Before customer sends: publish pages without login, confirm operator, align backend/helper to these scopes and complete Google setup. Local files are not publication evidence.
