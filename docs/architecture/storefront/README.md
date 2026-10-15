# Архітектура Storefront

**Область:** наявний Angular SSR застосунок `apps/storefront`. Цей розділ описує фактичну композицію, маршрути й модулі Brevi Storefront. Він не переносить правила React Admin на Angular.

## Де шукати код

- [Карта наявних модулів](modules.md) — Nx projects Storefront і їхні ролі.
- [Виконання Storefront](runtime.md) — SSR, hydration, маршрути, локалізація, стан і перевірки.
- [Поточна API-межа](../api/storefront.md) — налаштований HTTP pipeline і фактичні споживачі.
- `apps/storefront/src/app/app.config.ts` — глобальні providers: router, HTTP/interceptors, hydration, Transloco і PrimeNG.
- `apps/storefront/src/app/app.routes.ts` — локалізовані маршрути `/uk` і `/ru` та композиція маршрутів feature-бібліотек.
- `libs/storefront/feature/*/src/lib/lib.routes.ts` — маршрути відповідних feature; у `order-in-bulk` і `regions` є додатковий однойменний рівень каталогу.

## Межі відповідальності

`apps/storefront` збирає застосунок. `libs/storefront/feature/*` містять окремі сценарії та сторінки; `shell` — спільну оболонку, `ui` — повторно використовувану презентацію, `data-access` — доступ до даних, `util` — утиліти. Загальні `libs/shared/*` використовуються за фактичними публічними API. Перед зміною перевір точні залежності в коді й Nx, не припускаючи, що кожна feature має власні `model` або `data-access` бібліотеки.

## Правила та перевірки

- [Frontend inventory](../frontend-inventory.md) — поточний стек і Nx targets.
- [Правила UI Storefront](../../standards/storefront-ui.md) — PrimeNG і стилізація.
- [Індекс standards](../../standards/README.md) — область застосування інших правил.
- [Специфікації](../../specs/README.md) — наявні feature specs; створюй нову лише за правилами проєкту.
