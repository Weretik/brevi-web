# TS-007 — Маршрути, меню й приймання

- **ID задачі:** TS-007
- **Охоплює:** SC-002, SC-006
- **Залежить від:** TS-002–TS-006
- **Точні шляхи:** `apps/admin-react/src/app/router/`, `libs/admin/products/feature/src/index.ts`, `apps/admin-react-e2e/src/products.spec.ts`
- **Рівень тестування:** модульний + компонентний + інтеграційний (E2E для критичного маршруту)

## Робота

- [x] Підключити lazy product pages через public export, активувати лише пункт «Товари» до списку.
- [x] Перевірити прямі адреси, back/forward, mobile drawer, фокус, 320/768/1280 px та обидві теми.
- [x] Після lint запустити relevant typecheck/tests/build/E2E й записати evidence.
- [x] Перевірити змінені файли реалізації на цілісність відповідальності; незалежні ролі розділити за наявними межами, невеликий цілісний файл зберегти.

## Свідчення

- [Red/Green/Refactor/Regression, точні команди та результати](evidence.md#ts-007)

## Контрольна точка

Усі product SC-* verified і route chunks відділені.
