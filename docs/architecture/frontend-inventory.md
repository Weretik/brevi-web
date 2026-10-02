# Інвентаризація frontend

**Перевірено:** 2026-10-01

Цей файл фіксує лише наявну архітектуру й команди. Його потрібно оновлювати,
коли змінюються застосунки, менеджер пакетів або тестові цілі.

## Застосунки

| Застосунок             | Технологія               | Фактичний стан                                                  | Цілі перевірки                                          |
| ---------------------- | ------------------------ | --------------------------------------------------------------- | ------------------------------------------------------- |
| `apps/storefront`      | Angular 21, SSR, PrimeNG | Робочий storefront; feature-код переважно в `libs/storefront/*` | `lint`, `build`; test target відсутній                  |
| `apps/admin-react`     | React 19, Vite, MUI      | Робочий Admin із shell, довідниками та керуванням товарами      | `lint`, `typecheck`, `typecheck-tests`, `test`, `build` |
| `apps/admin-react-e2e` | Playwright, Chromium     | Browser journeys для критичних сценаріїв Admin                  | `lint`, `typecheck`, `e2e`, atomized `e2e-ci`           |

## Межі коду

- Angular storefront використовує Nx libraries `shared` і `storefront`.
- React Admin має композицію у `apps/admin-react/src/app/`, shell у
  `libs/admin/core/shell` та доменні бібліотеки `products` і `references`.
- Mobile application не входить до scope цього repository.

## Менеджер пакетів і скрипти

- Node.js: `24.18.0`, зафіксований у `.nvmrc` і `.node-version`; підтримуваний
  діапазон — `>=24.15.0 <25`.
- Менеджер пакетів: `npm@11.6.2`, lock-файл `package-lock.json`.
- Кореневі скрипти містять `test:web`, його варіанти для модульних,
  компонентних, інтеграційних, coverage та E2E-тестів, а також
  `typecheck:tests`, `docs:check`, `docs:format:check` і `storefront:start`
  разом із наявними командами збірки, lint і форматування.
- Nx визначає цілі для кожного проєкту; перед плануванням задачі перевіряйте
  `npx nx show project <project> --json`.
- `contracts:sync`, `contracts:generate` і `contracts:check` підтримують
  OpenAPI snapshot та generated API types для React Admin.

## Тестові інструменти й наявні тести

- Встановлено Vitest, Angular Vitest adapter, React Testing Library,
  `jest-dom`, `user-event` і `@playwright/test`/`@nx/playwright`.
- React Admin має окремий `vitest.config.mts`, налаштування jsdom і виконуваний
  набір unit, component та integration тестів.
- `admin-core-shell` має окремі lint, typecheck, typecheck-tests і Vitest test
  targets та компонентні тести.
- `apps/admin-react-e2e` має Playwright config, Chromium smoke і Nx inferred
  targets. Chromium binary встановлюється локально/в CI командою
  `npx playwright install chromium`.

Встановлена dependency сама по собі не робить test level доступним. Нова React
library повинна мати executable Nx test target/config і focused test. Новий
інструмент оформлюється окремим `EN-*` до його додавання.
