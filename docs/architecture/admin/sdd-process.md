# SDD-процес frontend-функціональності

Frontend feature планується від observable scenarios до найменших технічних
responsibilities. Правила готовності визначають
[delivery rules](../../standards/shared/delivery-rules.md), а test strategy —
[testing rules](../../standards/shared/testing-rules.md).

## Послідовність

1. Зафіксувати actor, goal, scope, exclusions і стабільні бізнес-правила `R-*`.
2. Описати acceptance scenarios `SC-*` у Given / When / Then лише через
   спостережувану поведінку.
3. Визначити потрібні області: спільна поведінка; стан/отримання даних;
   UI React Web; браузерна навігація/глибокі посилання; браузерні
   адаптери/дозволи; інтеграція з API; компонентна, інтеграційна та
   E2E-перевірка.
   Для API feature до реалізації заповнити `contracts/api-contract.md` з
   `operationId`, backend OpenAPI source і commit/tag. Якщо синхронізація та
   генерація відсутні, додати `EN-*` за
   [contract workflow](../api/contract-workflow.md).
4. Обрати найвужчий test level за ризиком і перевірити фактичний tooling.
5. Розкласти реалізацію на `TS-*` та shared prerequisites на `EN-*`, додати
   dependencies, exact paths, evidence targets і checkpoints.
6. Заповнити `traceability.md` до початку реалізації.
7. Після погодження виконувати ready tasks за їхніми залежностями,
   checkpoints і evidence у feature SDD.

Не створюйте порожні optional files. Якщо великій feature потрібні phases,
phase-файли залишаються orchestration index, а реалізація живе в малих task-файлах.

## Поточні архітектурні обмеження

Фактичний стан apps і tooling описаний у
[frontend inventory](../frontend-inventory.md). Mobile application не входить
до scope. React Admin має app, shell і browser test targets; для нової
бібліотеки перевіряйте її власні target/setup перед плануванням automated
evidence.
