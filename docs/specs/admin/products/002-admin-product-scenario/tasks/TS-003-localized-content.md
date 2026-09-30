# TS-003 — Двомовний описовий контент

- **ID задачі:** TS-003
- **Охоплює:** SC-003
- **Залежить від:** EN-001, TS-002
- **Точні шляхи:** `libs/admin/products/feature/src/components/product-detail-content.tsx`, `libs/admin/products/feature/src/components/product-description-fields.tsx` (цільові), `libs/admin/products/feature/src/components/product-base-fields.tsx`, `libs/admin/products/feature/src/components/product-detail-content.component.test.tsx` (цільовий)
- **Рівень тестування:** компонентний

## Робота

- [x] Одночасно показати український і російський Description, Information і Characteristics з чіткими підписами; у формі редагувати обидві мови без перемикача.
- [x] Рендерити Description через EN-001; показати безпечне прев'ю у формі, plain text для Information і значення таблиць; читати порядок за `sortOrder`.
- [x] Не вводити глобальну локалізацію чи клієнтські HTML поля.
- [x] Перевірити змінені файли на цілісність відповідальності; рішення записати в `code-audit/audit.md`. Розділити незалежні ролі за наявними межами, але не невеликий цілісний файл.

## Свідчення

- Шлях/назва фокусного тесту: Обидві мови видимі в detail/form; `<script>`, image, table і небезпечний URL не стають активним DOM.
- Red: Фокусний Playwright на порту 4313 впав на відсутньому перегляді опису.
- Green: Markdown component + dual language E2E; npx nx test admin-products-feature — 11/11, npx nx test admin-products-data-access — 11/11, product Playwright — 6/6.
- Refactor: межі відповідальностей перевірено в code-audit/audit.md; фокусні та повні перевірки повторено.
- Regression: ADMIN_REACT_BASE_URL=http://localhost:4319 npx nx e2e admin-react-e2e --workers=2 — 25/25.

## Контрольна точка

SC-003 показує обидві локалізації та безпечний форматований опис.
