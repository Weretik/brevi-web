# Поетапна реалізація

Latest P5 checkpoint — 2026-10-29: backend TS-009/010 committed locally as `e5f563456efd1b29a67a36805c2b3775ce2f9d06` without push, then FE-EN-002 synced and checked the clean OpenAPI. FE-008 ready/PDF integration passed focused automated tests; manual PDF/privacy acceptance remains open. TS-016 and FE-011 are partially implemented. [Contract evidence](../evidence/fe-en-002-p5-2026-10-29.md), [FE-008 evidence](../evidence/fe-008-integration-2026-10-29.md). No frontend commit/push authorization.

P1–P4 реалізовано локально. FE-005 підключає історію та lifecycle; FE-006 додає приватний custom editor; FE-007 — files/templates/suggestions. Current snapshot/generated types pin backend `e5f563456efd1b29a67a36805c2b3775ce2f9d06`. No frontend commit/push is implied by this plan.

| Фаза               | Backend prerequisite   | Frontend                  | Умова виходу                                                             |
| ------------------ | ---------------------- | ------------------------- | ------------------------------------------------------------------------ |
| P0                 | EN-001                 | FE-EN-001                 | Реальні маршрути/межі/права/Nx test targets                              |
| P1 клієнти         | TS-001/002             | FE-EN-002, FE-001/002     | Наявна вкладка створює/читає клієнта/контакт, scope/merge доведені       |
| P2 чернетки КП     | EN-002, TS-003/004     | FE-EN-002, FE-003/004     | Server-priced snapshot із позиціями/трьома цінами round-trip             |
| P3 історія         | TS-005                 | FE-EN-002, FE-005         | Явний reprice, conflict, copy/transfer/archive, незмінна V1              |
| P4 custom          | EN-003, TS-006/007/008 | FE-EN-002, FE-006/007     | Версії/альтернативи/реальні приватні файли/шаблони                       |
| P5 ready/PDF       | EN-005, TS-009/010/016 | FE-EN-002, FE-008, FE-011 | Verified seller/tax/numbering, public PDF без витоку                     |
| P6 send/package    | EN-004, TS-011/012     | FE-EN-002, FE-009         | Правдиві delivery states, explicit test send, pinned production artifact |
| P7 архів/приймання | EN-006, TS-013/014/015 | FE-010                    | Звірка/повнота або погоджені gaps, recovery та інтегровані докази        |

EN-005 підтверджено користувачем 2026-10-29: реквізити та податкова фраза з Calculator діють; формат номера N/M/YYYY, спільна місячна послідовність із 10. Backend TS-009/010 локально перевірено з PostgreSQL, FE-EN-002 завершено, FE-008 має автоматично перевірену інтеграцію; ручне PDF/privacy приймання відкрите. TS-016 і FE-011 часткові. EN-004 потребує реального mail provider/config; EN-006 — повного експорту/байтів або погодженого gap scope й retention.

## Атомарні задачі

| ID                                  | Відповідальність                             | Залежності                                                 |
| ----------------------------------- | -------------------------------------------- | ---------------------------------------------------------- |
| [FE-EN-001](readiness/fe-en-001.md) | Базова структура та перевірки домену         | Немає; узгодити backend EN-001                             |
| [FE-EN-002](readiness/fe-en-002.md) | Контрактний handoff кожного API slice        | Відповідна backend TS-задача та FE-EN-001                  |
| [FE-001](clients/fe-001.md)         | Межа даних клієнтів                          | FE-EN-001, FE-EN-002 для backend TS-002                    |
| [FE-002](clients/fe-002.md)         | Список, картка й контакти наявної вкладки    | FE-001                                                     |
| [FE-003](quotes/fe-003.md)          | Межа даних та моделі КП                      | FE-001, FE-EN-002 для backend TS-003/004                   |
| [FE-004](quotes/fe-004.md)          | Редактор позицій і варіантів КП              | FE-003, FE-002                                             |
| [FE-005](quotes/fe-005.md)          | Версії, перерахунок, передача й архів        | FE-004, FE-EN-002 для backend TS-005                       |
| [FE-006](custom-sewing/fe-006.md)   | Приватний редактор індивідуального пошиття   | FE-004, FE-EN-002 для backend TS-006                       |
| [FE-007](custom-sewing/fe-007.md)   | Приватні файли, шаблони та підказки          | FE-006, FE-EN-002 для backend TS-007/008                   |
| [FE-008](documents/fe-008.md)       | Реквізити продавця, ready та PDF             | FE-005, FE-007, FE-EN-002 для backend TS-009/010; EN-005   |
| [FE-009](documents/fe-009.md)       | Явне надсилання, історія та виробничий пакет | FE-008, FE-EN-002 для backend TS-011/012; EN-004           |
| [FE-010](release/fe-010.md)         | Звіт перенесення та інтегроване приймання    | FE-002, FE-005, FE-007, FE-008, FE-009; backend TS-013/014 |

## Додаткова задача першого знайомства

| ID                            | Відповідальність                             | Залежності                                        |
| ----------------------------- | -------------------------------------------- | ------------------------------------------------- |
| [FE-011](documents/fe-011.md) | Сезонні добірки й власні selection templates | FE-007/008, FE-EN-002 для TS-016; FE-009 для send |

## Закриття кожного slice

Зафіксувати operationIds + справжній SHA → sync/generate/check → data-access runtime mapping → interaction та error tests → existing route/menu → focused code audit/форматування → evidence/traceability/implemented map; manual narrow/wide/accessibility перенесено користувачем на завершальне приймання. Не запускати міграції/імпорт/надсилання з UI до відповідного backend gate. Не комітити/пушити лише на підставі цього документа.

P6 FE-009 delivery/history and production-export UI implemented with pinned contract; [automated evidence](../evidence/fe-009-delivery-production-2026-10-30.md). EN-004 live consent/send and template-management/new-selection integration remain separate.

## Required before live Gmail acceptance

[FE-EN-003](readiness/fe-en-003.md): implement and publish description/privacy/terms on office.brevi.com.ua; confirm operator, domain ownership, exact Google Branding URLs and send-only runtime/helper alignment. Sender pp.brevi@gmail.com; manual uncertain-result review; In production setup. These are mandatory EN-004/SC-D03 gates, not optional follow-ups.
