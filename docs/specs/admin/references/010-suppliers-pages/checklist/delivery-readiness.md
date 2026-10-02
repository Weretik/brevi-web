# Постачальники — готовність до постачання

- [ ] EN-001 and contracts verified.
- [ ] All SC verified/deferred and task evidence recorded.
- [ ] Context menu, locale, routes, themes/viewports verified.
- [ ] No action column or create/view/edit dialog remains.
- [ ] Contracts/lint/typecheck/tests/E2E/build passed.
- [ ] Audit/traceability/report complete.

## Delivery checkpoint — 2026-10-01

**Результат:** blocked before delivery.

- TS-002 list checkpoint завершено: action column прибрана; shared MUI context
  menu працює мишею й клавіатурою, повертає focus, не змінює selection і
  зберігає confirm-before-delete.
- Shared Material/Data Grid `ukUA`, feature lint/typecheck/tests, contracts check
  і production build пройшли.
- EN-001 заблоковано: pinned snapshot і latest backend HEAD не містять
  `getSupplierById`. Через це TS-001, TS-003, TS-004 і TS-005 не ready.
- E2E, direct reload, detail/editor routes, themes і 320/768/1280 px не
  перевірялися, бо відповідні surfaces ще не можуть бути реалізовані за
  погодженим контрактом.
- View/edit dialogs тимчасово збережено, щоб готова list-зміна не ламала чинні
  дії переходом на відсутні route pages.
