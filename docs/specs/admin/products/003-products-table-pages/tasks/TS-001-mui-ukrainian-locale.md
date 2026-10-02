# TS-001 — Центральна українська locale MUI

- **ID задачі:** TS-001
- **Статус:** completed
- **Охоплює:** SC-003
- **Залежить від:** немає
- **Точні шляхи:** `apps/admin-react/src/app/theme/brevi-theme.ts`, можливий
  `apps/admin-react/src/app/theme/ukrainian-locale.ts`, theme tests
- **Рівень тестування:** модульний, компонентний

## Робота

- [x] Підключити офіційні core і Data Grid `ukUA` до обох тем.
- [x] Перевірити доступні в застосунку Data Grid keys і через підтриманий MUI
      locale API доповнити українською лише відсутні, не створюючи власного i18n.
- [x] Прибрати конфліктні локальні overrides, залишивши feature-specific empty text.
- [x] Перевірити цілісність відповідальності theme/locale й записати рішення в
      `code-audit/audit.md`; окремий файл створити лише якщо locale перестає бути
      малою частиною theme.

## Свідчення

- Шлях тесту: `apps/admin-react/src/app/theme/brevi-theme.unit.test.ts` та
  component smoke з меню Data Grid.
- Red: focused Vitest мав 1/4 failed: locale Data Grid не була підключена.
- Green: theme unit test перевіряє core/Data Grid `ukUA` в light/dark; app integration
  відкриває локалізоване меню колонки й перевіряє пагінацію.
- Refactor: locale лишилася малою частиною `brevi-theme.ts`; feature-specific empty
  state реалізовано slot-компонентом без локального `localeText` override.
- Regression: `npx nx test admin-react` — 18/18; app/test typecheck і
  `npx nx build admin-react` — success.

## Контрольна точка

Одна theme locale обслуговує всі цільові Data Grid без англійських системних
підписів.
