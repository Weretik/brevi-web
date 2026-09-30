# EN-001 — Nx library для спільного shell

- **ID задачі:** EN-001
- **Уможливлює:** SC-001, SC-002, SC-003, SC-005, SC-006
- **Залежить від:** немає
- **Точні шляхи:** `libs/admin/core/shell/project.json`, `libs/admin/core/shell/src/index.ts`, `libs/admin/core/shell/tsconfig*.json`, `libs/admin/core/shell/vitest.config.mts`, `tsconfig.base.json`
- **Рівень тестування:** перевірка налаштування

## Робота

- [x] Звірити чинні Nx targets, module boundaries і структуру бібліотек;
      створити лише потрібну `@admin/core/shell` library з публічною точкою
      входу та executable component test target/config.
- [x] Підтвердити, що `apps/admin-react` може імпортувати library за публічним
      alias, а library не залежить від Angular або app modules.
- [x] Перевірити змінені файли реалізації на цілісність відповідальності.
      Розділити лише файли, що поєднують незалежні ролі або складні для
      підтримки; зберегти невеликий цілісний файл незалежно від кількості рядків.

## Свідчення

- Чому поведінковий Red не має сенсу: library і її test target ще не існують.
- Перевірені Nx targets/config: `npx nx show project admin-core-shell --json`
  показав lint/typecheck/typecheck-tests/test; `tsconfig.base.json` містить
  `@admin/core/shell`.
- Перевірка module boundaries, alias та executable test:
  `npx nx lint admin-core-shell`, `npx nx typecheck admin-core-shell`,
  `npx nx run admin-core-shell:typecheck-tests` і
  `npx nx test admin-core-shell` пройшли. App test після додавання
  `resolve.tsconfigPaths` імпортує shell через public alias.
- Уможливлені поведінкові задачі: TS-001–TS-004.

## Контрольна точка

`npx nx show project <фактична назва shell project> --json` показує lint,
typecheck/test targets, а test target виконує справжній тест; TS-002/TS-003
можуть отримати поведінковий Red.
