# Root-cause: чому шаблони не зупинили architecture violations

## Висновок

Проблема виникла не в одному task. Старий процес перевіряв business behavior,
test evidence і component decomposition, але не мав обов'язкового architecture
baseline та blocking remediation gate. Він дозволяв вважати existing pattern
допустимим, записати системну розбіжність як ризик і завершити feature без її
виправлення. Додатково фактичні Nx constraints суперечили target layers.

## Прогалини до цього оновлення

| Джерело                                      | Попередня прогалина                                                                 | Як вона дозволяла порушення                                           | Виправлення                                                              |
| -------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `feature/design/frontend.md`                 | Аудитував roles файлів, але не вимагав matrix projects/tags/layers/tools/public API | `products.model.ts` у data-access міг бути прийнятий як current owner | Додано architecture baseline з rule source, mismatch і prerequisite task |
| `feature/tasks/phases/00-readiness.md`       | Не порівнював Nx constraints і approved stack із standards                          | Feature могла стати ready поверх неможливої dependency matrix         | Додано blocking check і remediation dependency                           |
| `feature/tasks/phases/02-state-data.md`      | Говорив про hooks/store/cache загально                                              | `useEffect/useState + fetch` виглядав допустимою «наявною межею»      | Явно зафіксовано RTK Query та forbidden manual server lifecycle          |
| `feature/tasks/phases/05-api-integration.md` | Вимагав DTO mapping/cache, але не перевіряв canonical API client                    | Паралельний direct-fetch transport не блокував phase                  | Додано baseApi check і заборону public private infrastructure            |
| `TS/EN task templates`                       | Перевіряли переважно cohesion зміненого файла                                       | Task не перевіряв owner, tags, aliases, DTO/tool boundary             | Додано architecture baseline до кожної executable task                   |
| `feature checklists`                         | Вимагали записане рішення, а не закриті findings                                    | `planned` refactor міг пройти delivery                                | In-scope findings тепер повинні бути `verified`                          |
| `ai-feature-workflow/01`                     | Передавав gaps до audit без prerequisite semantics                                  | AI міг продовжити feature поверх відомого порушення                   | Finding у dependency chain тепер блокує task до EN/RM checkpoint         |
| `ai-feature-workflow/02`                     | Казав слідувати existing boundaries                                                 | Existing wrong tool/path міг копіюватися                              | Current implementation більше не є доказом allowed pattern               |
| `ai-feature-workflow/03`                     | Вимагав записати structural decisions                                               | Запис не гарантував реалізацію й regression                           | Gate вимагає виконані fixes, graph/import/tool searches і tests          |
| `code-audit`                                 | Фокусувався на великих UI components і reuse                                        | Не охоплював Nx, RTK Query, DTO, aliases, barrels, test typecheck     | Додано сім audit phases і `AF-*` traceability                            |
| `code-audit` scope rule                      | Дозволяв винести structural issue в окрему задачу як ризик                          | Finding міг залишитися без owner/dependency                           | Deferred дозволено лише явно погоджено; prerequisite не можна deferred   |
| `eslint.config.cjs`                          | Не мав `type:model`; `type:ui` дозволяв `type:feature`                              | Документовані layers не можна було чесно створити й enforce           | RM-001 виправляє dependency matrix до moves                              |

## Початкова точка проблеми

Найраніша процесна помилка була у readiness: шаблон не вимагав спочатку
довести, що target architecture підтримується Nx rules і що feature використовує
approved repository stack. Через це наступні tasks оптимізували локальний код у
межах уже неправильних owners. Code audit наприкінці перевіряв decomposition,
але не мав повноваження заблокувати delivery через системне finding.

Оновлений порядок: inventory → rules/constraints → remediation prerequisites →
behavior tasks → повний audit → verified findings → delivery.
