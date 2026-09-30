# Правила тестування

## Джерело tooling

Перед плануванням тестів перевірте `package.json`, lockfile, Nx project targets,
test configs і наявні test files. [Frontend inventory](../architecture/frontend-inventory.md)
є знімком, але фактичний repository state має пріоритет.

Не вважайте Jest, Vitest, React Testing Library, Playwright чи інший інструмент
доступним лише через звичність або згадку в документації.
Dependency без config, target і виконуваного test file означає prerequisite,
який оформлюється окремим `EN-*`. Новий package лише рекомендуйте, доки його
встановлення не входить до погодженого scope.

## Вибір найвужчого рівня за ризиком

| Ризик                                                           | Основний рівень тестування             |
| --------------------------------------------------------------- | -------------------------------------- |
| Чисті функції, мапінг, форматування, валідація                  | Модульний                              |
| Хук, сховище, кеш, переходи стану, отримання даних              | Фокусний інтеграційний                 |
| Компонент, форма, стан завантаження/порожній/помилка, взаємодія | Компонентний                           |
| Навігація, глибоке посилання, дозвіл, сховище або адаптер       | Інтеграційний                          |
| Мапінг запиту/відповіді API та помилки транспорту               | Фокусний інтеграційний або контрактний |
| Критичний сценарій користувача між екранами/сервісами           | E2E                                    |

Один `SC-*` може мати кілька вузьких тестів для різних ризиків. Не повторюйте
повний сценарій на unit, component, integration та E2E рівнях. E2E потрібен для
критичного journey, а не автоматично для кожного acceptance scenario.

## Проєктування тестів від сценаріїв

`SC-*` не є виконуваним тестом. Це стабільний acceptance contract, з якого
виводяться конкретні automated tests. Сценарій відповідає на питання «що бачить
або може зробити користувач», а тест — «на якому технічному рівні найдешевше й
надійно довести цей ризик».

Наприклад, один сценарій фільтрації може мати unit test нормалізації параметрів
і component test підтвердження форми. Повторювати весь сценарій в обох тестах або
додавати E2E без окремого journey-ризику не потрібно.

- Кожен новий або змінений observable behavior посилається на `SC-*` і
  відповідні `R-*`.
- Сценарій описує поведінку користувача у Given / When / Then без назв
  components, hooks, stores, libraries або files.
- Тест перевіряє public contract чи видимий результат. Один тест має один
  зрозумілий outcome.
- Component tests використовують semantic roles, accessible names і реальні
  interaction events, які підтримує наявний setup.
- Test data детерміновані й не містять secrets або реальних персональних даних.
- Manual evidence допустиме лише для ризику, який наявне tooling об'єктивно не
  може автоматизувати; причина записується в task і traceability.

## Архітектура тестів у цьому repository

- Тести належать Nx project, поведінку якого перевіряють, і розміщуються поруч
  із source як `*.test.ts`/`*.test.tsx` або в наявному project test directory.
- Pure TypeScript rules перевіряються без DOM і framework providers.
- State/data-fetching tests збирають мінімальний реальний store/provider graph і
  підміняють лише зовнішню transport boundary. Не створюйте глобальний mock
  backend або нову mocking library без окремого `EN-*`.
- React component tests використовують Vitest і React Testing Library після
  створення project target та одного `test-setup`. Глобальний setup містить лише
  DOM matchers/polyfills; feature fixtures і mocks лишаються локальними.
- App-level integration tests перевіряють composition providers, routing і
  browser adapters лише коли ризик перетинає межі однієї library.
- Browser E2E використовує окремий `admin-react-e2e` Nx project і покриває
  кілька критичних journeys. Новий E2E додається лише для окремого journey-ризику.
- Coverage збирається на CI після появи стабільного набору tests. Порогові
  значення вводяться окремим рішенням на основі baseline, а не довільним числом.

Базовий React harness уже налаштований в `apps/admin-react`. Для нової library
перевірте її Nx target/config і додайте перший behavioral test у відповідному
`TS-*`. Наявний harness smoke перевіряє лише працездатність test infrastructure
і не є evidence бізнес-сценарію.

## Імена тестів і команди

- `*.unit.test.ts` або `*.unit.test.tsx` — pure functions і validation.
- `*.component.test.tsx` — React UI та user interactions.
- `*.integration.test.ts` або `*.integration.test.tsx` — state, data fetching,
  routing і browser boundaries.
- `*.spec.ts` у `apps/admin-react-e2e` — browser E2E journeys.

Команди верхнього рівня: `npm run test:web`, `npm run test:web:coverage`,
`npm run test:web:e2e` та `npm run typecheck:tests`. Окремі порожні test levels
можуть завершуватися успішно через `--passWithNoTests`, але readiness потребує
щонайменше одного реально виконаного behavioral або infrastructure test.

## Red → Green → Refactor → Regression

Для кожного нового testable behavior у `TS-*`:

1. **Red** — додайте найменший behavioral test, запустіть його й зафіксуйте
   очікувану невідповідність `R-*`/`SC-*`.
2. **Green** — реалізуйте найменшу повну зміну, яка робить focused test зеленим.
3. **Refactor** — поліпшіть структуру в межах тієї самої відповідальності та
   повторіть focused test.
4. **Regression** — запустіть affected suite/targets і запишіть команду та
   результат.

Compilation error, broken fixture, missing dependency, invalid test setup або
unrelated failure не є валідним Red. Спочатку виправте prerequisite через
`EN-*`, а потім отримайте behavioral Red.

## Винятки

Red-first може не мати сенсу для documentation-only work, generator/setup,
нового test harness або platform prerequisite. Таку роботу оформлюйте `EN-*` з
`Enables`, причиною винятку та replacement verification. Виняток не скасовує
фінальну перевірку enabled scenario.

## Свідчення

Task-файл зберігає test name/path, Red failure, Green result, refactor note і
regression result. `traceability.md` містить лише посилання `SC → TS/EN → test →
evidence` та статус. Для невиконаної команди вкажіть точну команду, failure
point і чи причина pre-existing.

Для поточного репозиторію типові доступні перевірки:

```powershell
npx nx lint <project>
npx nx test <project>
npx nx typecheck <project>
npx nx build <project>
npm run format:check -- <paths>
```

Виконуйте лише targets, які показує `npx nx show project <project> --json`.
Для API feature додатково перевіряйте sync/generate/check за
[contract workflow](../architecture/api/contract-workflow.md), runtime mapping
і помилки. Contract scripts поки не існують; до їх реалізації записуйте
конкретний `EN-*`, не позначаючи перевірку виконаною.
