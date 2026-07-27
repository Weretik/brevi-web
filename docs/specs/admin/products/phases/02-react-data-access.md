# Фаза 2: React data-access для списку товарів

**Статус:** accepted  
**Залежить від:** [фаза 1](01-admin-api-contract.md)  
**Блокує:** фази 3–5

## Мета

Підключити `@admin/products/data-access` до затвердженого Admin API через RTK
Query та надати feature типізований hook без transport-деталей.

## Межі

- У межах: endpoint у `baseApi`, transport DTO, перетворення DTO в доменну модель
  та публічний export hook. Query/response типи, значення за замовчуванням і
  нормалізація належать `@admin/products/model`.
- Поза межами: JSX, MUI, фільтри, Data Grid, Redux slice, зміни `baseApi` або
  глобального store.

## Рішення

- Endpoint оголошується через `baseApi.injectEndpoints` у
  `@admin/products/data-access`.
- `AdminProductListItem`, `ProductsListQuery`, `ProductsListPage`, значення за
  замовчуванням і pure-нормалізація розміщені в `@admin/products/model`.
  `@admin/products/data-access` залежить від model через публічний alias, що
  дозволено Nx dependency boundaries.
- Hook приймає `ProductsListQuery`, нормалізує його перед mapping у transport
  params і виконує `GET /api/admin/products`.
- RTK Query cache key формується з початкового аргументу hook. Семантично
  однакові, але по-різному ненормалізовані аргументи можуть створити окремі
  cache entries.
- Некоректна структура відповіді відхиляється mapper'ом на межі data-access і
  не передається до feature як доменна модель.

## Сценарії

1. Given `ProductsListQuery`, when feature викликає hook, then відправляється
   один GET з query string і повертаються модель рядків, `totalRecords` та
   стандартні RTK Query стани.
2. Given два різні query, when вони запитуються, then RTK Query не змішує їхні
   кешовані відповіді.

## Критерії приймання

- [ ] У `ProductsPage` немає Axios або прямого HTTP.
- [ ] DTO не виходить за межі `data-access`.
- [ ] Канонічні доменні типи імпортуються з `@admin/products/model`; public API
      `data-access` містить hook і сумісні re-export'и.
- [ ] Дотримані Nx dependency boundaries.

## Перевірка

- `npx nx lint admin-products-data-access`.
- Автоматизовані тести не додаються в межах поточного scope.

## Результат реалізації

- Створено `productsApi` з `useGetProductsListQuery` для
  `GET /api/admin/products`.
- Query нормалізується та мапиться на `SearchTerm`, `InStock`, `IsSale`,
  `IsNew`, `PriceFrom`, `PriceTo`, `Sort`, `Page`, `PageSize`.
- Відповідь API перевіряється на межі data-access і мапиться у типізовану page
  модель з `@admin/products/model`; DTO не потрапляє у feature.
- `npx nx lint admin-products-data-access` і
  `npx nx lint admin-products-model` завершилися успішно.
- `npx tsc --noEmit --project libs/admin/products/model/tsconfig.lib.json` і
  `npx tsc --noEmit --project libs/admin/products/data-access/tsconfig.lib.json`
  завершилися успішно.

## Історія змін

- 2026-07-24: фазу реалізовано й прийнято; автоматизовані тести не додавалися
  за погодженим scope.
- 2026-07-25: доменні query/result-моделі перенесено до
  `@admin/products/model`; документацію синхронізовано з чинними Nx boundaries
  та поведінкою RTK Query cache key.
