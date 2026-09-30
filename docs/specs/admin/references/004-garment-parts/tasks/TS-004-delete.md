# TS-004 — Одиночне та масове видалення

- **ID задачі:** TS-004
- **Охоплює:** SC-004
- **Залежить від:** TS-003
- **Точні шляхи:** `libs/admin/references/feature/src/components/garment-parts/`, `libs/admin/references/data-access/src/garment-parts/`
- **Рівень тестування:** компонентний + інтеграційний

## Робота

- [x] Діалог показує кількість записів; одиночна і bulk дія використовують `deleteGarmentPart` для кожного підтвердженого ID.
- [x] Список оновлюється після дії; часткова невдача показує ID та зберігає їх у виборі.
- [x] Bulk кнопку вимкнено без вибору; MUI Dialog керує клавіатурою і фокусом, E2E перевірив підтвердження.
- [x] Операції вибору й видалення у hook; діалог лише відображає підтвердження.

## Свідчення

- Фокусний тест: `garment-parts-page.component.test.tsx` (підтвердження і часткова невдача).
- Red: первинний `npx nx test admin-references-feature -- garment-parts-page.component.test.tsx` — вибір рядків і підтвердження відсутні; 3 behavioral failures.
- Green: та сама команда — 5 тестів успішно; перед підтвердженням fetch виконував лише read.
- Refactor: єдиний deletion hook для рядкової і bulk дії; повторний focused run успішний.
- Regression: `npx nx test admin-references-feature` — 22/22 після фінального повтору; `npx nx e2e admin-react-e2e --grep 'garment parts'` — 3/3. Попередній одночасний із E2E запуск мав timeout у сторонньому fabrics test; послідовний повтор пройшов.

## Контрольна точка

Видаляються тільки підтверджені записи, часткові помилки видимі.
