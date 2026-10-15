# Локальний запуск і діагностика

**Перевірено:** 2026-10-15 за `package.json`, Nx targets та конфігурацією
застосунків. Це інструкція для локального checkout; параметри зовнішнього
deployment потрібно звіряти з фактичною інфраструктурою.

## Підготовка

У корені використовується Node.js `24.18.0` (`.nvmrc`, `.node-version`),
допустимий діапазон `>=24.15.0 <25`, npm `11.6.2` і `package-lock.json`.
Для відтворюваного встановлення запускай `npm ci` у корені. Перед роботою з
окремою бібліотекою дізнайся її Nx targets через
`npx nx show project <name> --json`.

## Застосунки

| Дія                           | Команда                                            | Що перевірити                                                                                      |
| ----------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Локальний Angular Storefront  | `npx nx serve storefront`                          | Маршрути `/uk` і `/ru`; backend URL у `apps/storefront/src/environments/environment.ts`            |
| Production build Storefront   | `npx nx build storefront`                          | Browser і server output у `dist/apps/storefront`                                                   |
| Локальний запуск server build | `npm run storefront:start`                         | `PORT` або типовий порт `4000`; Node SSR entry `server/server.mjs`                                 |
| Build React Admin             | `npx nx build admin-react`                         | Vite build і застосовні `VITE_*` параметри з Admin config                                          |
| Перевірка документації        | `npm run docs:check` і `npm run docs:format:check` | Посилання/формат Markdown                                                                          |
| Перевірка API snapshot Admin  | `npm run contracts:check`                          | Snapshot і generated types; процес у [contract workflow](../architecture/api/contract-workflow.md) |

У корені також є `storefront:build-cloudflare` як Nx target. Його наявність
не підтверджує, що production розгорнуто саме на Cloudflare; для вибору
середовища потрібен окремий запис deployment pipeline.

## Типові збої

1. Якщо команда Nx не існує, перевір `npx nx show project <name> --json`.
   Storefront не має окремого test target станом на цю перевірку.
2. Якщо SSR server не стартує, спочатку виконай `npx nx build storefront`,
   перевір `dist/apps/storefront/server/server.mjs` і `PORT`.
3. Якщо `/uk` або `/ru` поводяться інакше між dev і build, звір
   `app.routes.ts`, `app.routes.server.ts` та
   [runtime Storefront](../architecture/storefront/runtime.md).
4. Якщо майбутній HTTP consumer звертається не туди, звір
   `environment.api.baseUrl` та
   [поточну API-межу](../architecture/api/storefront.md). Сам по собі
   налаштований `HttpClient` не доводить наявність запиту.
5. Якщо типи Admin API не відповідають backend, дотримуйся
   [contract workflow](../architecture/api/contract-workflow.md),
   не редагуй generated файли вручну.

Додаткові команди тестів Admin наведені в
[правилах тестування](../standards/shared/testing-rules.md).
