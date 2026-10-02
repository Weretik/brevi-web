# TS-004 — Спільна create/edit форма товару

- **ID задачі:** TS-004
- **Статус:** completed
- **Охоплює:** SC-006, SC-007, SC-008
- **Залежить від:** немає
- **Точні шляхи:** `product-editor.tsx`, `product-*-fields.tsx`,
  `product-create-page.tsx`, `product-edit-page.tsx`, model/tests
- **Рівень тестування:** компонентний, модульний

## Робота

- [x] Зберегти один editor для create/edit; зробити create user fields
      порожніми/unselected, edit — заповненими detail.
- [x] Розмістити кожну логічну групу полів у білій MUI Card/Paper й прибрати
      поля з голого page background.
- [x] Додати відповідні назви primary action, не змінюючи validation/payload.
- [x] Зберегти помилки, введене, write lock, cancel і type-change confirmation.
- [x] Перевірити відповідальності editor/field components і записати аудит.

## Свідчення

- Тест: `product-editor.component.test.tsx`, наявні model tests.
- Red: focused component test failed через стару назву action і відсутні card regions.
- Green: один набір component tests перевіряє create/edit values, regions та окремі
  actions «Створити товар»/«Зберегти зміни».
- Refactor: layout surface винесено в stateless `product-form-section.tsx`; єдиний
  draft, lookup, validation, write lock і save orchestration лишилися в editor.
- Regression: feature suite — 27/27; contracts check і products E2E — passed.

## Контрольна точка

Create/edit відрізняються даними й основною дією, але мають одну карткову форму.
