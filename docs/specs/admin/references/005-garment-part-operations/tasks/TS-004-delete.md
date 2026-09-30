# TS-004 — Одиночне та масове видалення

- **ID задачі:** TS-004
- **Охоплює:** SC-004
- **Залежить від:** TS-003
- **Точні шляхи:** `libs/admin/references/feature/src/components/garment-part-operations/`, `libs/admin/references/data-access/src/garment-part-operations/`
- **Рівень тестування:** компонентний + інтеграційний

## Робота

- [x] Підтвердження показує кількість; одиночний і bulk шлях використовують `deleteGarmentPartOperation` для кожного ID.
- [x] Після дії список оновлюється, часткові невдачі показують ID і лишають їх у виборі.
- [x] Дія без вибору disabled; MUI dialog підтримує клавіатуру/focus.
- [x] Selection, deletion state і dialog розділені за наявними межами.

## Свідчення

- Фокусний тест: `garment-part-operations-page.component.test.tsx` — до підтвердження DELETE немає; часткова невдача лишає вибір.
- Red: окремий виконуваний Red для цієї задачі не зафіксовано; до зміни видалення робіт не існувало.
- Green: component suite 5/5; Playwright `garment-part-operations.spec.ts` — 3/3.
- Refactor: bulk orchestration у hook, confirmation у component; feature suite повторено успішно.
- Regression: повний feature test, lint, typecheck, build, E2E — успішно.

## Контрольна точка

Видаляються тільки підтверджені записи, часткові помилки видимі.
