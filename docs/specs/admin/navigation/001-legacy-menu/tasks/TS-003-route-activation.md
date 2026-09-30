# TS-003 — Активація маршрутів

- **ID задачі:** TS-003
- **Охоплює:** SC-002, SC-003
- **Залежить від:** TS-002
- **Точні шляхи:** `apps/admin-react/src/app/router/`, `libs/admin/core/shell/src/navigation/`
- **Рівень тестування:** інтеграційний + E2E

## Робота

- [x] Підготувати спільний route registry для появи route й активації пункту; зафіксувати старі URL чотирьох сторінок у карті.
- [x] Перевірити пряме відкриття, back/forward, активну групу, мобільне закриття й фокус для наявних маршрутів.
- [x] Перевірити змінені файли реалізації на цілісність відповідальності; розділити лише незалежні ролі, зберігаючи невеликі цілісні файли.

## Свідчення

- Фокусний тест: `app-router.integration.test.tsx` і `admin-react.shell.spec.ts`.
- Red: пункт активний без route або direct URL не знаходить сторінку.
- Green/Refactor/Regression: записати `npx nx test admin-react`, `npx nx e2e admin-react-e2e`, build та результат.

Виконано 2026-09-27:

- Red: інтеграційний тест із TS-001 не знаходив груп і не міг перевірити відсутність link без route; окремого live Red для перенесеної таблиці немає, бо React-сторінка ще не існує.
- Green: `navigation-config.unit.test.ts` перевіряє, що `/references/supplier` стає посиланням лише за наявності у реєстрі, а однойменний пункт менеджера лишається недоступним; `app-router.integration.test.tsx` перевіряє всі legacy leaf без link у поточному app.
- Refactor: `availableRoutes` у `app-router.tsx` одночасно створює `<Route>` і набір активних шляхів; додавання відповідної page в цей список активує її пункт без другого прапорця. Повторний `npx nx test admin-react` — 10/10.
- Regression: `npx nx e2e admin-react-e2e` — 5/5: старий прямий URL зараз дає fallback, після переходу на `/` browser back повертає fallback; 320 px drawer закривається й повертає фокус; `npx nx build admin-react` — успішно.
- Майбутні table-features додадуть чотири React-сторінки за `/references/garment-accessory`, `/references/garment-part-operation`, `/references/supplier`, `/references/additional-reference` і тоді матимуть власне live evidence SC-002.

Уточнення 2026-09-27: після видалення «Початок» у поточному React app немає переходу з меню. Закриття drawer після переходу перевіряє `admin-layout.component.test.tsx` з тестовим доступним маршрутом; E2E тепер перевіряє клавіатурне відкриття, Escape і повернення фокуса. Живий перехід з меню для SC-002/SC-003 лишається відкладеним до table-features.

## Контрольна точка

Пункт стає активним лише після доступності відповідної сторінки.
