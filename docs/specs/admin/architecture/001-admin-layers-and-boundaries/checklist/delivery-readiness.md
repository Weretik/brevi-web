# Готовність remediation до постачання

- [x] AF-001–AF-010 мають статус `verified`.
- [x] Target Nx projects/tags/constraints і project graph відповідають design.
- [x] Products/references model, data-access, ui і feature мають визначених owners.
- [x] Shared contracts/config/baseApi є canonical paths; compatibility видалена.
- [x] Generated DTO не імпортуються feature/UI; private infrastructure не exported.
- [x] Direct domain fetch і manual server query lifecycle відсутні.
- [x] Root public entry points є єдиними cross-library aliases/imports.
- [x] Data-access nesting відповідає ролям; empty/dead paths і stale docs відсутні.
- [x] Source/test typecheck, focused/regression tests, contracts, E2E і build пройшли.
- [x] Code audit final gate та traceability оновлені після останньої зміни.
