# Застосунок і маршрутизація Admin

## Застосунок `apps/admin`

Застосунок є точкою композиції. Тут розміщені запуск React, кореневі провайдери,
маршрутизація, глобальні стилі та підключення feature-бібліотек. Бізнес-правила,
API-виклики й доменні компоненти тут не розміщуються.

`AppRouter` залишається коренем композиції: він підключає layout, об’єднує
доменні маршрути, задає глобальний fallback і не імпортує реалізації сторінок.
Кожен домен експортує іменовану конфігурацію маршрутів із публічної точки входу.

```text
productsRoutes ─┐
ordersRoutes   ─┼→ AppRouter
clientsRoutes  ─┘
```

Приклад допустимого підключення:

```ts
import { productsRoutes } from '@admin/products/feature';
import { ordersRoutes } from '@admin/orders/feature';
```

`AdminLayout` залишається елементом маршруту з `Outlet`. Розташування файла
router може змінюватися без зміни цього правила.

## Lazy loading route features

- Feature pages that are route entries export a default page component and load
  through the short form `lazy(() => import('./pages/<page>'))` from their
  `<domain>.routes.tsx` module. Named-export adapters with `.then(...)` are not
  used for route pages.
- `AdminLayout` owns the single `Suspense` fallback around `Outlet`; pages and
  features do not duplicate route-loading spinners. Fallback показує лише стан
  завантаження route chunk; він не виконує server request і не дублює loading
  state конкретної сторінки.
- Shell, route configuration and minimal route metadata may remain in the
  initial chunk. Page implementation, heavy domain UI and optional MUI X
  packages must remain behind the relevant route boundary.
- Manual chunk configuration is introduced only after bundle analysis shows a
  cross-route dependency that route-level lazy loading cannot split.
- Зміна route boundaries перевіряється lint для shell і змінених feature, а
  також `npx nx build admin`; build output має містити окремі page chunks.
