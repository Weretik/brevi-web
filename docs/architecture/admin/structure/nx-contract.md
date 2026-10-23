# Admin Nx Contract and Public API

## Tags and aliases

New Admin libraries receive tags by scope, domain, and type:

```json
{ "tags": ["scope:admin", "domain:products", "type:feature"] }
```

Aliases follow these patterns:

```text
@admin/<domain>/<layer>
@admin/core/<area>
@admin/shared/<area>
```

## Public library API

Each library exposes its allowed API only through `src/index.ts`. Pages are
not exported by default: the application wires route configuration, not page
implementations.

```ts
// Correct
import { productsRoutes } from '@admin/products/feature';
import { ProductCard } from '@admin/products/ui';

// Incorrect
import { ProductsPage } from '@admin/products/feature/src/pages/ProductsPage';
```

The target `@nx/enforce-module-boundaries` configuration checks `scope`,
`domain`, and `type`. Until `domain:*`, `type:model`, and orchestration
exceptions are fully configured, also check these rules during code review.
