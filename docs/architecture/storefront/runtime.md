# Виконання Storefront: SSR, маршрути та стан

**Перевірено:** 2026-10-15 за кодом `apps/storefront` і `libs/storefront`.
Це опис наявної реалізації, а не вимога до майбутніх feature.

## Точка композиції та запуск

`apps/storefront/src/main.ts` завантажує Angular у браузері; `main.server.ts`
завантажує той самий `App` з серверним контекстом. `app.config.ts` реєструє
router, HTTP client з Fetch backend, глобальну обробку помилок, Transloco,
PrimeNG та hydration. `app.config.server.ts` додає server rendering і правила
`app.routes.server.ts`. Збірка `storefront:build` у `apps/storefront/project.json`
має `outputMode: server`: браузерні файли і Node server потрапляють до
`dist/apps/storefront`.

`apps/storefront/src/server.ts` створює Express server. Він віддає статичні
файли з `dist/apps/storefront/browser`, а решту запитів передає
`AngularNodeAppEngine`. Порт задає `PORT`, типовий — `4000`. Команда
`npm run storefront:start` запускає зібраний `server/server.mjs`.
Окремого API endpoint у цьому Express server зараз немає: фрагмент у файлі
закоментований як приклад.

## SSR, prerender і hydration

Server routes налаштовують prerender для `/uk`, `/ru` і загального `**`.
`/uk/catalog`, `/ru/catalog`, `/uk/product-page` і `/ru/product-page`
мають `RenderMode.Client`; їх не слід описувати як серверно відрендерені.
Поведінку конкретного URL перевіряй з урахуванням порядку маршрутів і
фактичного build output. Під час клієнтського запуску ввімкнені event replay,
incremental hydration і HTTP transfer cache без POST-запитів.

Поряд із Node SSR target є `storefront:build-cloudflare`, який викликає
статичну збірку, і файл `apps/storefront/public/_worker.js`. Це окремий шлях
розгортання; документ не стверджує, що саме його використовує production.

## Маршрути й локалізація

`app.routes.ts` перенаправляє `/` на `/uk`, а `/uk` і `/ru` збирають
feature routes із `libs/storefront/feature/*`. Невідомий локалізований шлях
веде на сторінку `404`; загальний wildcard додає поточну локаль до URL через
`LocaleNavigationService`. Перелік наявних Nx libraries є в
[карті модулів](modules.md).

Transloco підтримує `uk` і `ru`, основна й запасна мова — `uk`. Поточну мову
визначає `LocaleNavigationService`; `APP_INITIALIZER` завантажує переклад до
відображення і синхронізує текст PrimeNG. `TranslocoHttpLoader` бере переклади
з TypeScript modules у `apps/storefront/src/app/localization/translations`,
а не з мережевого API.

`SeoHreflangService` в `App` оновлює canonical і hreflang (`uk-UA`, `ru-UA`,
`x-default`) після навігації. Абсолютну базу бере з `environment.publicSiteUrl`.
Під час зміни домену, локалі або маршруту перевіряй також ці посилання.

## Дані, стан і помилки

Поточні feature-сторінки використовують Angular signals і локальний стан
компонентів; наприклад, каталог має `signal`/`computed` для елементів UI.
Наявність `libs/storefront/data-access` не означає, що каталог уже отримує
товари з backend: у поточному Storefront-коді немає викликів `HttpClient` з
feature або data-access. Зареєстрований HTTP pipeline і його межа описані в
[Storefront API](../api/storefront.md).

`provideGlobalErrorHandling()` підключає `GlobalErrorHandler` та PrimeNG
`MessageService`. `errorInterceptor` нормалізує HTTP failure в `AppApiError`;
feature має окремо показувати свої loading, empty і error states після
появи реального запиту. Наявність глобальної обробки не доводить, що всі
сценарії UI уже обробляють помилки.

## Перевірка змін

- Маршрути, i18n, SEO: перевір локалізовані URL, redirects, canonical і
  hreflang у браузері та після server build.
- SSR/hydration: `npx nx build storefront`, потім `npm run storefront:start`;
  перевір відповідь на prerender/client маршрутах і hydration у браузері.
- API: звір конфігурацію та фактичний consumer за
  [Storefront API](../api/storefront.md); не записуй успіх HTTP-тесту без
  виконуваного consumer і тесту.
- Перед запуском `nx test storefront` перевір target через
  `npx nx show project storefront --json`: станом на цю перевірку окремого
  test target немає.

Загальні правила перевірки наведені в
[правилах тестування](../../standards/shared/testing-rules.md).
