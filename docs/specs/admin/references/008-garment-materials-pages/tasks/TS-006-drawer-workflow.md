# TS-006 — MUI Drawer для тканини й фурнітури

- **ID задачі:** TS-006
- **Статус:** completed
- **Охоплює:** SC-004–SC-006, SC-008
- **Залежить від:** TS-002
- **Точні шляхи:** list contents/pages, editor hooks, domain Drawer, tests
- **Рівень тестування:** component/E2E

## Робота

- [x] Замінити create/view/edit Dialog двома правими MUI Drawer.
- [x] Повторно використати shared `ReferenceEditorDrawer` shell.
- [x] Зберегти поля, validation, supplier lookup/error/retry і write errors.
- [x] Зберегти row actions у MUI context menu для pointer і keyboard.
- [x] Видалити застарілі Dialog та перейменувати mode types на EditorMode.
- [x] Перевірити responsive Drawer для обох вкладок.

## Свідчення

- Red: focused component run — 2/13 failed, бо view усе ще був Dialog із
  disabled inputs замість read-only Drawer sections.
- Green: focused component run — 2 files, 13/13 passed.
- E2E: `garment-accessories.spec.ts` — 3/3 passed після чистого restart Vite;
  охоплено create error, right-click view/edit/delete і bounds обох Drawer.
- Audit: [code-audit/audit.md](../code-audit/audit.md).

## Контрольна точка

Create/view/edit тканини й фурнітури працюють у Drawer, а дії рядка — через MUI
context menu без action column.
