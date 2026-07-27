# Стан, API та форми Admin

## Серверний стан і API

- Серверний стан реалізується RTK Query і належить `data-access`.
- Кореневий Redux store розміщений у `apps/admin/src/app/store.ts`.
- Спільний API розміщений у `@admin/shared/api-client`; transport-деталі задані в
  [ADR-0001](adr/0001-admin-axios-transport.md).
- `admin/core/auth` передає API-клієнту `AuthSessionAdapter`; API-клієнт не
  зберігає токени й не знає endpoint оновлення сесії.
- Кожен домен оголошує endpoints у власній `data-access`-бібліотеці через
  `baseApi.injectEndpoints`.
- Feature використовує лише експортовані типізовані hooks і не звертається до
  `baseApi` напряму.
- Усі зовнішні дані валідуються та перетворюються на межі `data-access`.

## Структура `@admin/shared/api-client`

`@admin/shared/api-client` — спільна transport infrastructure. Його кореневий
`src/index.ts` містить лише стабільні публічні exports; усі внутрішні реалізації
групуються за ролями:

```text
libs/admin/shared/api-client/src/
├── index.ts
├── client/        # створення Axios instance
├── contracts/     # ApiRequest, ApiError, auth contracts
├── errors/        # нормалізація transport/API помилок і тести
├── interceptors/  # auth header, refresh/retry, logging та їх installer
├── rtk-query/     # baseApi і Axios base query
└── runtime/       # runtime configuration: session adapter, error notifier
```

- Один модуль не поєднує Axios client, interceptor, RTK Query base query,
  transport contract і error mapper.
- Interceptor не володіє глобальним application state; session adapter і error
  notifier належать `runtime` та налаштовуються через публічний API.
- Domain `data-access` libraries оголошують endpoints тільки через
  `baseApi.injectEndpoints`; вони не створюють власний Axios instance і не
  імпортують внутрішні модулі `api-client`.
- Публічні exports transport layer змінюються лише окремим сумісним рішенням.
- Зміна transport behavior супроводжується релевантними тестами error mapping
  або interceptor behavior та перевіркою `npx nx build admin`.

## Структура `@admin/shared/config`

`@admin/shared/config` ізолює Vite environment від решти Admin. Публічний
`src/index.ts` експортує готовий `appConfig` і тип `AppConfig`; читання
`import.meta.env`, парсинг значень та складання конфігурації не змішуються:

```text
libs/admin/shared/config/src/
├── index.ts
├── env/
│   ├── admin-environment.types.ts
│   └── environment-reader.ts
└── config/
    ├── app-config.types.ts
    └── app-config.ts
```

- Лише `env/environment-reader.ts` звертається до `import.meta.env` і містить
  Vite type reference.
- `config/app-config.ts` є чистою функцією з явним environment input; усі
  fallback і parsing правила зосереджені в `env`.
- Споживачі імпортують тільки `appConfig` з `@admin/shared/config`, а не Vite
  env чи внутрішні модулі config.

## Локальний і клієнтський стан

Локальний стан залишається у `feature`. Клієнтський стан домену, який має
переживати розмонтування або використовуватися кількома сторінками, розміщується
у `feature/state/<domain>.slice.ts`; reducer явно експортується для реєстрації в
store. Не створюється slice для даних, які вже кешує RTK Query.

## Форми

Форма належить feature-сценарію. `ProductForm` отримує дані й обробники через
props, не викликає API та не керує маршрутизацією; сторінки викликають mutations.
Спільні контроли переносяться до `@admin/shared/ui` лише після доведеного
повторного використання. Бібліотека форм і схема валідації обираються окремим ADR
до першої реалізації.
