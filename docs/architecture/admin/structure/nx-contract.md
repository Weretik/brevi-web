# Nx-контракт і публічний API Admin

## Теги та aliases

Нові бібліотеки Admin отримують теги за областю, доменом і типом:

```json
{ "tags": ["scope:admin", "domain:products", "type:feature"] }
```

Aliases відповідають шаблону:

```text
@admin/<domain>/<layer>
@admin/core/<area>
@admin/shared/<area>
```

## Публічний API бібліотек

Кожна бібліотека розкриває дозволений API лише через `src/index.ts`. Сторінки за
замовчуванням не експортуються: застосунок підключає конфігурацію маршрутів, а не
реалізацію сторінки.

```ts
// Правильно
import { productsRoutes } from '@admin/products/feature';
import { ProductCard } from '@admin/products/ui';

// Неправильно
import { ProductsPage } from '@admin/products/feature/src/pages/ProductsPage';
```

Цільова конфігурація `@nx/enforce-module-boundaries` перевіряє `scope`, `domain`
і `type`. До повного налаштування `domain:*`, `type:model` та orchestration-виключень
ці правила додатково перевіряються під час code review.
