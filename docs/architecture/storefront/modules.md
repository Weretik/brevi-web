# Наявні модулі Storefront

Це карта поточних Nx projects за їхніми `project.json`. Фактичні targets і версії перевіряй у [frontend inventory](../frontend-inventory.md) та конфігурації проєктів.

| Область           | Наявні Nx projects                                                                               | Відповідальність                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| Застосунок        | `apps/storefront`                                                                                | Angular SSR, маршрути й глобальні providers                         |
| Основа Storefront | `libs/storefront/{data-access,shell,ui,util}`                                                    | Дані, оболонка, презентація й утиліти                               |
| Feature           | `libs/storefront/feature/{home,catalog,contacts,about-us,not-found}`                             | Основні та інформаційні сторінки                                    |
| Feature           | `libs/storefront/feature/order-in-bulk/order-in-bulk`, `libs/storefront/feature/regions/regions` | Оптове замовлення й регіони; у коді є вкладений однойменний каталог |

`apps/storefront/src/app/app.routes.ts` підключає feature routes під префіксами `/uk` та `/ru`; кореневий шлях веде на `/uk`. Наявність бібліотеки не доводить готовність кожного сценарію. Спільні `libs/shared/*` перевіряй за кодом і [frontend inventory](../frontend-inventory.md).
