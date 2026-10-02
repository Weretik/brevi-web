# RM-001 — Nx tags і dependency constraints

- **Findings:** AF-001
- **Requirements:** AR-001
- **Depends on:** EN-001
- **Exact paths:** `eslint.config.cjs`, affected `libs/admin/**/project.json`,
  `tsconfig.base.json`, boundary verification evidence.

## Work

- [x] Додати primary types `model`, `api-client`, `contract`; прибрати
      суперечливі multiple `type:*` tags.
- [x] Реалізувати dependency matrix із design; прибрати `ui → feature`.
- [x] Перевірити дозволені target imports і негативні reverse/cross-scope cases.

## Evidence

- `eslint.config.cjs` містить односторонні constraints для `model`, `ui`,
  `api-client`, `data-access`, `feature`, `core`, `app` і `contract`.
- Uncached lint пройшов для 14 Admin projects; Nx graph не містить reverse
  `model/ui → feature/data-access` dependencies.

## Verification

- `npx nx run-many -t lint` для affected Admin projects без cache.
- Project graph і documented positive/negative boundary evidence.

## Checkpoint

Нові model/ui/shared projects можна створити з правильними tags без послаблення
reverse dependency rules; AF-001 verified.
