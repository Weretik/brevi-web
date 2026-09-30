# Інвентаризація frontend

**Перевірено:** 2026-09-26

Цей файл фіксує лише наявну архітектуру й команди. Його потрібно оновлювати,
коли змінюються застосунки, менеджер пакетів або тестові цілі.

## Застосунки

| Застосунок             | Технологія               | Фактичний стан                                                       | Цілі перевірки                                          |
| ---------------------- | ------------------------ | -------------------------------------------------------------------- | ------------------------------------------------------- |
| `apps/storefront`      | Angular 21, SSR, PrimeNG | Робочий storefront; feature-код переважно в `libs/storefront/*`      | `lint`, `build`; test target відсутній                  |
| `apps/admin`           | Angular 21, PrimeNG      | Поточний Angular Admin; код у `libs/admin/*` і `libs/shared/*`       | `lint`, `test`, `build`; test files не знайдені         |
| `apps/admin-react`     | React 19, Vite, MUI      | Спільний shell Brevi, тема, `/` і fallback; бізнес-сторінок ще немає | `lint`, `typecheck`, `typecheck-tests`, `test`, `build` |
| `apps/admin-react-e2e` | Playwright, Chromium     | Browser smoke та основа для критичних journeys                       | `lint`, `typecheck`, `e2e`, atomized `e2e-ci`           |

## Межі коду

- Angular apps використовують Nx libraries `shared`, `admin` і `storefront` із
  наявними типами `feature`, `ui`, `data-access`, `shell`, `util`, `contracts`.
- React Web має композицію у `apps/admin-react/src/app/` та
  `libs/admin/core/shell`. Бібліотеки доменних сторінок, API та auth залишаються
  цільовим design, а не описом наявного дерева.
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
- `contracts:sync`, `contracts:generate`, `contracts:check`, OpenAPI snapshot і
  generated API types поки відсутні. Перед першою API feature потрібен `EN-*`
  за [contract workflow](api/contract-workflow.md).

## Тестові інструменти й наявні тести

- Встановлено Vitest, Angular Vitest adapter, React Testing Library,
  `jest-dom`, `user-event` і `@playwright/test`/`@nx/playwright`.
- Angular Admin має `@angular/build:unit-test` target і `tsconfig.spec.json`.
- React Admin має окремий `vitest.config.mts`, налаштування jsdom і виконуваний
  тест тестового середовища, а також поведінкові тести теми та маршрутів.
- `admin-core-shell` має окремі lint, typecheck, typecheck-tests і Vitest test
  targets та компонентні тести.
- `apps/admin-react-e2e` має Playwright config, Chromium smoke і Nx inferred
  targets. Chromium binary встановлюється локально/в CI командою
  `npx playwright install chromium`.
- Angular test files у `apps/` та `libs/` поки відсутні.

Встановлена dependency сама по собі не робить test level доступним. Нова React
library повинна мати executable Nx test target/config і focused test. Новий
інструмент оформлюється окремим `EN-*` до його додавання.
