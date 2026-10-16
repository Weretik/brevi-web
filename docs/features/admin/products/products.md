# Admin: товари

**Стан:** маршрути та сторінки реалізовані, звірено 2026-10-16.

`/references/products` показує список з пошуком, сортуванням, сторінками й видаленням; `/create`, `/:id` і `/:id/edit` відкривають створення, деталі та редагування. `products/feature` володіє сценаріями, локальним станом і обробкою loading/error/empty; `products/ui` — презентацією; `products/model` — доменними моделями; `products/data-access` — API endpoints, маперами і валідацією відповіді. Сторінки ліниво завантажує route-файл; `AppRouter` імпортує тільки `productsRoutes`.

## Схема будови

```mermaid
flowchart LR
  Router["AppRouter"] --> Routes["productsRoutes: lazy pages"]
  Routes --> Feature["products/feature: список, деталі, редактор"]
  Feature --> UI["products/ui: представлення"]
  Feature --> Model["products/model: типи"]
  Feature --> Data["products/data-access: API і мапери"]
```

## Структура в коді

```text
libs/admin/products/
├── data-access/src/
│   ├── api/
│   │   └── products.api.ts # API
│   └── mappers/
│       └── product.mapper.ts # мапер
├── feature/src/
│   ├── components/product-editor/
│   │   └── product-editor.tsx # редактор
│   ├── pages/
│   │   ├── product-detail/
│   │   │   └── product-detail-page.tsx # деталі
│   │   ├── product-editor/
│   │   │   └── product-create-page.tsx # створення
│   │   └── product-list/
│   │       └── products-page.tsx # сторінка списку
│   └── products.routes.tsx # маршрути
├── model/src/product-editor/
│   └── product-draft.ts # чернетка
└── ui/src/product-editor/core/
    └── product-base-fields.tsx # поля форми
```

**Де шукати:** [маршрути](../../../../libs/admin/products/feature/src/products.routes.tsx), [сторінка списку](../../../../libs/admin/products/feature/src/pages/product-list/products-page.tsx), [редактор](../../../../libs/admin/products/feature/src/components/product-editor/product-editor.tsx), [API](../../../../libs/admin/products/data-access/src/api/products.api.ts), [специфікації товарів](../../../specs/admin/products/README.md).
