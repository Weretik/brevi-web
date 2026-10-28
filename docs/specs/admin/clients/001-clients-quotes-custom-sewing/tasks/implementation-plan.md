# Поетапна реалізація

P1 та P2 реалізовано локально: FE-EN-001/002, FE-001/002 і FE-003/004 мають автоматичні докази; ручне приймання pending. P2 backend EN-002/TS-003/004 закріплено в `1c1f51dc7837f3d5e3a0da7326cb17b48d23e4d9`, frontend snapshot/generated types синхронізовано з цим SHA. Локальний backend commit дозволено користувачем 2026-10-27; push не виконувався. P3 in progress: TS-005 backend audited and committed as `f185138fc1cfc6c71cf94fe4e7103652e6719b5b`; current snapshot/generated types use this SHA. Independent FE-005 comparison is verified; connected lifecycle UI remains pending. [P2 evidence](../evidence/p2-frontend-2026-10-27.md).

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

EN-005 містить [NEEDS CLARIFICATION: фактичні реквізити продавця, формат/сфера номера та погоджені податкові/валютні формулювання]. Не вигадувати значення з порожньої таблиці. EN-004 потребує реального mail provider/config; EN-006 — повного експорту/байтів або погодженого gap scope й retention. Ці ворота не блокують клієнтів/чернетки.

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

Зафіксувати operationIds + справжній SHA → sync/generate/check → data-access runtime mapping → interaction та error tests → existing route/menu → focused code audit/форматування → manual narrow/wide/accessibility → evidence/traceability/implemented map. Не запускати міграції/імпорт/надсилання з UI до відповідного backend gate. Не комітити/пушити лише на підставі цього документа.
