# TS-003 — Карткова detail-сторінка товару

- **ID задачі:** TS-003
- **Статус:** completed
- **Охоплює:** SC-005, SC-008
- **Залежить від:** немає
- **Точні шляхи:** `product-detail-page.tsx`, `product-detail-*.tsx`,
  `sewing-product-detail.tsx`, `ppe-product-detail.tsx`, component tests
- **Рівень тестування:** компонентний

## Робота

- [x] Згрупувати наявні read-only дані в семантичні MUI Card/Paper без зміни полів.
- [x] Зберегти окрему кнопку «Редагувати», loading/error/not-found і direct URL.
- [x] Зробити горизонтальну/вертикальну адаптивну композицію за змістом.
- [x] Перевірити відповідальності змінених detail-компонентів і записати аудит.

## Свідчення

- Тест: `product-detail-page.component.test.tsx`.
- Red: focused component test failed через відсутні semantic card regions.
- Green: component test перевіряє всі read-only regions, edit URL і відсутність
  editable controls.
- Refactor: повторювану презентаційну MUI Card surface винесено в
  `product-detail-section.tsx`; fetch/delete/navigation лишилися у page.
- Regression: `npx nx test admin-products-feature` — 27/27; products E2E — passed.

## Контрольна точка

Detail показує повний чинний Product у кількох білих адаптивних секціях.
