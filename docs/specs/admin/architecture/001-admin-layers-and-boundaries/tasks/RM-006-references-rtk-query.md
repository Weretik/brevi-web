# RM-006 — References RTK Query migration

- **Findings:** AF-004
- **Requirements:** AR-004
- **Depends on:** RM-004
- **Exact paths:** `libs/admin/references/data-access/src/api/<capability>/`,
  `api/{shared,integration}/`, `mappers/<capability>/`, reference feature
  hooks/components/pages, app provider, reference tests.

## Work

- [x] Оголосити reference query/mutation endpoints через shared `baseApi`.
- [x] Визначити tags/invalidation для кожного resource без дубльованого cache.
- [x] Замінити manual list/editor/delete server lifecycle generated hooks та
      feature orchestration; зберегти field-error behavior.
- [x] Видалити references direct-fetch production path після parity evidence.

## Evidence

- Six reference resources використовують окремі resource endpoint modules,
  injected у спільний `adminApi`, із resource/list tags; failed mutations не
  запускають invalidation.
- Endpoint modules згруповано за capability; shared error policy та cross-resource
  integration tests мають окремих власників `api/shared` і `api/integration`.
- Direct production fetch відсутній; data-access 14/14 і feature 33/33 tests
  пройшли.

## Checkpoint

Усі reference server flows використовують спільний RTK Query base API через
resource endpoint modules; affected data-access/component/E2E regression green.
