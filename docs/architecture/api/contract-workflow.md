# Життєвий цикл API-контракту

Ці правила діють для кожної frontend feature, яка викликає backend API, незалежно
від Angular або React. Джерело істини — OpenAPI у backend-репозиторії. Frontend
зберігає відтворюваний snapshot конкретного backend commit; Markdown описує
лише рішення споживача, а не копіює схеми запитів і відповідей.

## Порядок роботи

1. До реалізації знайдіть операцію в backend OpenAPI. У feature
   `contracts/api-contract.md` зафіксуйте точний `operationId`, шлях до
   канонічного OpenAPI, backend repository та повний commit SHA або незмінний
   release tag. Для кількох операцій заповніть окремий рядок для кожної.
   Якщо операції немає або контракт не узгоджений, оформіть backend blocker;
   метод і URL самі по собі не замінюють `operationId`.
2. Синхронізуйте OpenAPI з чистого checkout за зафіксованим commit і збережіть
   у frontend походження snapshot: repository, commit, source path, дату та
   команду синхронізації. Snapshot YAML не редагуйте вручну; зміну контракту
   вносіть у backend і повторюйте синхронізацію.
3. Генеруйте TypeScript типи запитів і відповідей із snapshot. Generated files
   не редагуйте вручну й не дублюйте еквівалентні DTO в `contracts` або
   `data-access`. У transport/data-access використовуйте типи конкретної
   операції; локальні типи залишайте лише для моделей застосунку й клієнтських
   правил, відсутніх у OpenAPI.
4. Перевіряйте мережеву відповідь під час виконання перед перетворенням DTO.
   Статична генерація типів не є runtime-валідацією. Mapper на межі
   `data-access` повертає модель застосунку; `feature`, `ui` і domain model не
   імпортують generated DTO.
5. У feature-контракті документуйте клієнтські рішення: request mapping,
   response mapping, помилки, пагінацію, кеш/інвалідацію, повторні запити,
   скасування та обмеження. Посилайтеся на `operationId` і OpenAPI замість
   переписування полів схем у Markdown.
6. Запускайте перевірку snapshot, генерації, relevant typecheck, тести мапінгу
   й помилок, lint та build. Зміна backend contract і її frontend consumer
   мають проходити ці перевірки на одній зафіксованій версії.

## Стан інструментів у цьому репозиторії

Станом на 2026-09-26 у `package.json` немає `contracts:sync`,
`contracts:generate` чи `contracts:check`. У репозиторії немає OpenAPI snapshot,
generated API types, manifest походження або генератора. Наявні
`libs/admin/contracts` містять ручні request types, а Angular Admin `data-access`
викликає `HttpClient` з ручною типізацією. Не вважайте описаний вище цикл
автоматизованим і не позначайте API feature готовою за цим критерієм, поки
передумова не реалізована. Наявний код змінюйте окремими задачами без масового
перенесення.

Для першої API feature додайте `EN-*` із такими конкретними змінами:

- Виберіть backend checkout і канонічний OpenAPI entry point. Додайте
  versioned snapshot під `docs/contracts/openapi/` та `SOURCE.md` з backend
  repository, commit SHA, source path і способом відтворення.
- Додайте скрипт `contracts:sync`, який приймає backend checkout і commit,
  перевіряє чистоту checkout та відповідність `HEAD`, копіює OpenAPI й записує
  provenance. Не беріть «latest» без зафіксованої версії.
- Додайте зафіксований у lockfile генератор і `contracts:generate` для
  TypeScript output у спільній Nx library з type-only public export. Сумісність
  її alias і Nx boundaries перевірте перед вибором конкретного шляху.
- Додайте `contracts:check`, який валідовує OpenAPI, запускає генерацію у
  тимчасовому каталозі та порівнює результат з committed output без зміни
  робочого дерева. Окремо перевіряйте наявність `operationId` у snapshot.

Після появи скриптів перевірочна послідовність для API feature:

```powershell
npm run contracts:sync -- <backend-checkout> <backend-commit>
npm run contracts:generate
npm run contracts:check
npx nx lint <changed-project>
npx nx typecheck <changed-project>
npx nx test <changed-project>
npx nx build <app>
```

Перші три рядки є **цільовими командами**, а не поточними npm scripts.
`typecheck` і `test` запускайте лише для наявних Nx targets, перевірених через
`npx nx show project <project> --json`; для React test types доступні
`npm run typecheck:tests`. За відсутності target оформіть `EN-*` або точно
запишіть прогалину та доступний `tsc --noEmit --project <tsconfig>`.
