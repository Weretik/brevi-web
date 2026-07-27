# Домени та структура feature Admin

## Цільова структура

```text
libs/admin/
├── core/{shell,auth,permissions}/
├── shared/{ui,api-client,contracts,config,util,testing}/
├── products/{feature,data-access,model,ui}/
├── orders/{feature,data-access,model,ui}/
├── clients/{feature,data-access,model,ui}/
└── dashboard/{feature,data-access,ui}/
```

Новий код розміщується за цією структурою. Перенесення наявного коду виконується
лише окремою задачею.

## `admin/core`

`shell` містить каркас, навігацію, layout та область маршрутів; `auth` — сесію й
автентифікацію; `permissions` — перевірку прав. `core` не містить правил
конкретних доменів.

Новий код `core` групується за відповідальністю; корінь `src` не є місцем для
внутрішніх реалізацій. Цільові структури для нового або суттєво зміненого коду:

```text
libs/admin/core/
├── shell/src/
│   ├── index.ts
│   ├── layout/             # layout composition і content area
│   ├── navigation/         # nav config, sidebar, mobile drawer
│   ├── components/         # top bar, breadcrumbs, menus
│   └── hooks/              # shell-specific React hooks
├── auth/src/
│   ├── index.ts
│   ├── api/                # auth transport / RTK Query, якщо він з'явиться
│   ├── session/            # session model, provider, lifecycle
│   └── hooks/              # useAuth / useSession та інші public hooks
└── permissions/src/
    ├── index.ts
    ├── policies/           # permission rules і pure predicates
    ├── guards/             # route/action guards
    └── hooks/              # usePermission та похідні hooks
```

Папка створюється лише за наявності її відповідальності. Наявний плоский код не
переміщується масово: його розділення виконується разом зі зміною відповідної
функціональності або окремою задачею.

## Бізнес-домени

Домен ізольований і розкриває публічний API лише через кореневий `src/index.ts`.
Deep imports до внутрішніх модулів іншого домену заборонені.

| Шар           | Відповідальність                                          | Не повинен містити          |
| ------------- | --------------------------------------------------------- | --------------------------- |
| `feature`     | Екран, сценарій користувача, route entry, orchestration   | HTTP і спільні UI-примітиви |
| `data-access` | API, query/mutation hooks, DTO mapping, cache             | JSX і маршрути              |
| `model`       | Типи, інваріанти, чисті перетворення                      | React, HTTP, browser API    |
| `ui`          | Повторно використовувані domain presentational-компоненти | API, router, server state   |

`model` створюється лише за наявності спільної логіки або типів. Невеликий домен
може почати з `feature`; додаткові шари виділяються за появи нової
відповідальності чи повторного використання.

## Внутрішня структура domain library

`src/index.ts` у кожній library — лише публічний API. Внутрішній код не
розміщується поруч з ним «тимчасово» і не накопичується у великому файлі.
Застосовуються такі папки, якщо відповідна роль існує:

```text
libs/admin/<domain>/
├── data-access/src/
│   ├── index.ts
│   ├── api/                # injectEndpoints, hooks, endpoint definitions
│   ├── contracts/          # private transport DTO/request-response shapes
│   ├── mappers/            # DTO <-> domain/query transformations
│   ├── models/             # data-access-owned technical query/cache types
│   └── validators/         # response/query validation at the API boundary
├── model/src/
│   ├── index.ts
│   ├── entities/           # domain entities and value types
│   ├── queries/            # domain query types/defaults/invariants
│   ├── mappers/            # pure domain transformations
│   └── validators/         # pure domain validation where needed
├── ui/src/
│   ├── index.ts
│   ├── components/         # reusable presentational components
│   ├── tables/             # table shells, columns and cells
│   ├── forms/              # presentational forms and fields
│   └── states/             # loading/empty/error presentational states
└── feature/src/
    ├── index.ts
    ├── <domain>.routes.tsx
    ├── pages/              # route/page composition
    ├── components/         # feature-only composition controls
    ├── hooks/              # feature orchestration hooks
    └── state/              # local reducer/actions or durable client state
```

Це не вимога створити всі папки наперед. Це вимога не змішувати ролі: endpoint
не містить DTO parser, mapper не містить React-компонент, а таблиця не містить
server-state або маршрутизацію. Коли Nx boundary забороняє залежність
`data-access -> model`, data-access-owned типи залишаються в `data-access/models`;
глобальні module-boundary правила не послаблюються для локальної задачі.

### Приклад: products

`Домен products` зберігає модель товару, типи, інваріанти query та paginated result списку в `products/model`; `products/data-access` володіє endpoint, API DTO та mapper'ами.

```text
libs/admin/products/
├── model/src/
│   ├── entities/admin-product-list-item.ts
│   └── queries/
│       ├── products-list-page.ts
│       └── products-list-query.ts
└── data-access/src/
    ├── api/admin-products.api.ts
    ├── contracts/admin-products-list.contract.ts
    └── mappers/
```

## Внутрішня структура feature

Внутрішні модулі групуються за призначенням сценарію:

```text
libs/admin/products/feature/src/
├── index.ts
├── products.routes.tsx
├── pages/
├── components/
├── hooks/
└── state/
```

Папки створюються лише за наявності відповідного коду. Якщо сторінка стає
самостійною бізнес-межею, вона виділяється в окрему feature лише окремим
архітектурним рішенням.

## `admin/shared`

`admin/shared` містить лише код, спільний для кількох доменів: UI-примітиви,
API-клієнт, transport-контракти, config, util і testing. Він не залежить від
доменів. Код, потрібний одному домену, не переноситься до shared заздалегідь.
