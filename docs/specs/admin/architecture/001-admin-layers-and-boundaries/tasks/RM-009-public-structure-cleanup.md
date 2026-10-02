# RM-009 — Public API, nesting і cleanup

- **Findings:** AF-006, AF-007, AF-008, AF-010
- **Requirements:** AR-005, AR-006
- **Depends on:** RM-002–RM-008
- **Exact paths:** all affected `src/index.ts`, `tsconfig.base.json`, Vite aliases,
  products/references data-access internals, empty/deprecated paths, specs/inventory.

## Work

- [x] Замінити file alias `@admin/util/api-url` canonical root config alias.
- [x] Прибрати public exports transport helpers/private mappers/parsers.
- [x] Згрупувати data-access internals у `api/contracts/mappers/validators` після
      завершення model moves; оновити tests без deep cross-library imports.
- [x] Розкласти плоскі products `components/hooks/pages/collections`: у feature
      зберегти role-first structure і додати capability modules усередині
      кожної ролі; tests залишити поруч із файлом свого test level.
- [x] Розкласти плоскі references `pages/hooks` за capability усередині кожної
      ролі; узгодити `components`, tests, imports, public barrel і exact paths.
- [x] Розкласти references `api/entities/validators` за capability; винести
      shared API та UI primitives у названі modules із colocated tests.
- [x] Видалити compatibility aliases/re-exports, порожні каталоги й dead projects.
- [x] Оновити stale products README, frontend inventory і exact paths у specs.

## Evidence

- Canonical aliases ведуть до root entry points; data-access barrels експортують
  hooks, але не endpoint objects, mappers або parsers.
- Internals згруповані в `api/mappers/validators`; legacy projects/aliases
  видалені, exact contract paths і products README синхронізовані.
- Products feature використовує `pages/components/hooks/model` із вкладеними
  `product-list/product-editor/product-detail/product-deletion/media-library`;
  UI і model мають capability modules замість плоских каталогів.
- References feature використовує `pages/components/hooks/<capability>` для
  six-table modules; page/component tests залишені поруч із production-файлами.
- References data-access, model і UI не містять module-specific production
  файлів у корені role-каталогів; shared/integration owners названі явно.

## Checkpoint

Cross-library imports використовують лише canonical root entry points; forbidden
searches, graph review і all affected lint/typecheck/tests green.
