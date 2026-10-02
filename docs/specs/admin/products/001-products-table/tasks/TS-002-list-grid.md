# TS-002 — Список на MUI X

- **ID задачі:** TS-002
- **Охоплює:** SC-001, SC-006
- **Залежить від:** TS-001
- **Точні шляхи:** `libs/admin/products/feature/src/pages/product-list/`, `libs/admin/products/feature/src/components/product-list/`, `libs/admin/products/feature/src/hooks/product-list/`, `libs/admin/products/ui/src/product-list/`
- **Рівень тестування:** модульний + компонентний + інтеграційний (E2E для критичного маршруту)

## Робота

- [x] Показати серверну сторінку в MUI X Community Data Grid: назва, тип, доступні фото/ціна/дата та дії лише якщо підтримані контрактом.
- [x] Зв'язати контрольовані pagination/sort/filter/search із запитом; зміна умов скидає сторінку.
- [x] Показати loading/empty/error/retry, доступність і адаптивність; не копіювати SKU/status/stock зі скриншотів.
- [x] Перевірити змінені файли реалізації на цілісність відповідальності; незалежні ролі розділити за наявними межами, невеликий цілісний файл зберегти.

## Свідчення

- [Red/Green/Refactor/Regression, точні команди та результати](evidence.md#ts-002)

## Контрольна точка

Список показує тільки серверні рядки й фактичний total.
