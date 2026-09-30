# TS-002 — Групова навігація

- **ID задачі:** TS-002
- **Охоплює:** SC-001, SC-003
- **Залежить від:** TS-001
- **Точні шляхи:** `libs/admin/core/shell/src/navigation/`, `libs/admin/core/shell/src/layout/`
- **Рівень тестування:** компонентний + E2E

## Робота

- [x] Показати розкривні групи MUI з клавіатурним керуванням, disabled leaf-станом та активним вкладеним пунктом.
- [x] Зберегти desktop/mobile поведінку й видимий фокус; не додавати фіктивний пошук.
- [x] Перевірити змінені файли реалізації на цілісність відповідальності; розділити лише незалежні ролі, зберігаючи невеликі цілісні файли.

## Свідчення

- Фокусний тест: `admin-navigation.component.test.tsx` (план).
- Red: групи не розкриваються або disabled пункт здійснює перехід.
- Green/Refactor/Regression: записати `npx nx test admin-core-shell`, `npx nx e2e admin-react-e2e` та результат.

Виконано 2026-09-27:

- Red: `npx nx test admin-react -- app-router.integration.test.tsx` — групи відсутні; після появи UI `npx nx test admin-core-shell` виявив, що тестовий мобільний шлях потребує розкриття групи перед кліком.
- Green: `admin-layout.component.test.tsx` перевіряє Enter для групи, видимий стан «Ще не доступно», відсутність link, активний пункт і повернення фокуса; `npx nx test admin-core-shell` — 4/4.
- Refactor: листки загорнуті в семантичні `li`, drawer має власний вертикальний scroll; повторний component suite — 4/4.
- Regression: `npx nx test admin-react` — 10/10; `npx nx e2e admin-react-e2e` — 5/5, включно з 320 px та закриттям drawer.

Уточнення 2026-09-27: UI розділено за відповідальністю в тій самій `navigation/` папці: `admin-navigation.tsx` — контейнер, `admin-navigation-group.tsx` — розкриття, `admin-navigation-item.tsx` — стан листка й link. Фокусні `npx nx test admin-core-shell` — 4/4; legacy-групи залишаються доступними без пункту «Початок».

## Контрольна точка

Усі групи доступні з клавіатури; неготові пункти не переходять.
