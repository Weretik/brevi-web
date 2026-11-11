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

## Revision 2026-11-11: one work card per model

The owner found the two tabs confusing (UI/UX audit and three concepts on the [canvas](https://claude.ai/artifact/BJFf52pmG82YMi9hw8XptV)) and chose concept B «Робоча картка моделі», asking that «Основна» and «Додаткова» stand out. It replaces PRD-S30 to PRD-S33; PRD-S34 stays.

| ID      | Scenario                                                                                                                                                                                                                                                                   |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PRD-S35 | The page has no tabs: on the left the list of models (search, chips «Усі / З нормою / Без норми / Проблеми», one-colour metres), on the right the work card of the chosen model (`?model=MOD-052`, else the first in the list). «Імпорт» stays in the header.              |
| PRD-S36 | Three cards «1 колір», «2 кольори», «3 кольори»: each fabric on its own large line with a colour mark (graphite «Основна», orange «Додаткова», grey «Додаткова 2»), a bar of their shares and «Разом». An empty variant says «Не шиється у …» and offers «Додати варіант». |
| PRD-S37 | Below: «Підкладка, утеплювач, фліс» and «Решта складу» (every other line of the composition from «Товари», with a link «Склад у «Товари»»). Nothing of the composition is edited here.                                                                                     |
| PRD-S38 | «Рахувати на N шт.» multiplies every fabric, layer and composition line for a batch; empty by default, nothing is saved.                                                                                                                                                   |
| PRD-S39 | «Задати норму» / «Редагувати норму» opens the side panel with the fields grouped «1 колір», «2 кольори», «3 кольори» and labelled «Основна», «Додаткова»; «Видалити норму» asks first.                                                                                     |

Follow-up 2026-11-11 (owner): the three variant cards have one height, the fabrics of a variant stand side by side in one row with «Разом» in the card header, and «Решта складу» is on the left, «Підкладка, утеплювач, фліс» on the right.

A difference between the workshop norm and the fabric in the composition (71 of 124 models in the transfer files) is not marked until the owner says whether it is an error.
