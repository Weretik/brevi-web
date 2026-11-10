# Admin «Швейний цех», stage 9: «Норми витрати тканини» like the old «Цех», «Комплектація моделей»

**Status:** implemented 2026-11-11. Backend: BreviERP PRD-009 (`docs/sdd/specs/production/009-fabric-norms-and-compositions`). Reference: the old «Цех» page «Витрата тканини за моделями» (owner's screenshot, 2026-11-10). Changes [stage 1](../001-workshop-references/README.md).

## Scenarios

| ID      | Scenario                                                                                                                                                                                                                                                                  |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PRD-S30 | «Норми витрати тканини» has tabs «Норми тканини» and «Комплектація моделей» (`?tab=compositions`). «Імпорт» is shown only on the norms tab.                                                                                                                               |
| PRD-S31 | The norms table has the model name with «MOD-025 · Літо» under it, then column groups «1 колір» (Верх), «2 кольори» (Основна, Додаткова, Разом) and «3 кольори» (Основна, Додаткова 1, Додаткова 2, Разом), each value in metres or «—». Editing stays in the side panel. |
| PRD-S32 | «Комплектація моделей» shows a block per model (10 per page, search by name or MOD): name and «MOD · сезон», «Змінити комплектацію» to the «Комплектація» tab of the model card, the table «Призначення / Матеріал / Норма» for lining, insulation and fleece.            |
| PRD-S33 | «Повна комплектація · N рядків» folds out the full composition from «Товари»: kind, article (or «Усі»), material with its code and comment, norm with its unit. Nothing is edited on this tab.                                                                            |
| PRD-S34 | «Правила зарплати» is gone from the menu and «Права доступу»; the old address opens «Параметри ціноутворення».                                                                                                                                                            |

## Decisions

- The composition is not copied: it is read from «Товари» each time the tab opens, so there is one source.
- No «all OK» marks: a model without a layer says so in one line, a missing composition says it is not set.
- The norms of the 14 models the client sheet has and Brevi lacks, and MOD-095, are loaded through «Імпорт» after the owner's «да».
