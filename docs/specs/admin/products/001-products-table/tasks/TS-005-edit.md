# TS-005 — Повне редагування товару

- **ID задачі:** TS-005
- **Охоплює:** SC-004
- **Залежить від:** TS-004
- **Точні шляхи:** `libs/admin/products/feature/src/pages/product-editor/`, `libs/admin/products/feature/src/components/product-editor/`, `libs/admin/products/feature/src/hooks/product-editor/`, `libs/admin/products/feature/src/hooks/product-detail/`, `libs/admin/products/data-access/src/`
- **Рівень тестування:** модульний + компонентний + інтеграційний (E2E для критичного маршруту)

## Робота

- [x] Завантажити detail у форму й виконувати replaceProduct з повним payload, не частковий PATCH.
- [x] Обробити 400/404/409, не стирати draft; після успіху перейти до detail з новим read, а список перечитати при відкритті.
- [x] Перевірити обидва типи товару та deep link на edit.
- [x] Перевірити змінені файли реалізації на цілісність відповідальності; незалежні ролі розділити за наявними межами, невеликий цілісний файл зберегти.

## Свідчення

- [Red/Green/Refactor/Regression, точні команди та результати](evidence.md#ts-005)

## Контрольна точка

Повна заміна відповідає контракту й оновлює деталі.
