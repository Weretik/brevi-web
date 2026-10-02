# TS-004 — Підтверджене видалення

- **ID задачі:** TS-004
- **Охоплює:** SC-006, SC-007
- **Залежить від:** TS-001, TS-002
- **Точні шляхи:** `libs/admin/products/ui/src/media/media-delete-dialog.tsx`,
  за потреби `src/hooks/media-library/use-media-deletion.ts`, focused component test
- **Рівень тестування:** компонентний

## Робота

- [x] Додати card action і confirm dialog з filename, cancel, destructive
      confirm та disabled pending state.
- [x] На 204 прибрати картку через refresh/invalidation і повідомити успіх; на
      409 залишити картку й пояснити використання; network/404 обробити за contract.
- [x] Повернути фокус до картки або стабільного сусіда/заголовка, якщо картку
      видалено; dialog має працювати з клавіатури.
- [x] Не додавати optimistic permanent removal або bulk selection.
- [x] Перевірити dialog/hook/page responsibilities і записати рішення в
      `code-audit/audit.md`.

## Свідчення

- Шлях або назва фокусного тесту: `media-delete-dialog.component.test.tsx` або
  сценарії у `media-page.component.test.tsx`.
- Команда Red та очікувана поведінкова помилка:
  `npx nx test admin-products-feature -- media-delete` — confirm/outcomes відсутні.
- Фактичний Red не зафіксовано окремо від спільного page test через початковий
  блокер icon import; це process deviation, а не Green evidence.
- Команда Green і результат: focused test проходить cancel/204/409 і focus
  restoration після завершення transition.
- Примітка про рефакторинг: mutation state у hook, dialog відповідає лише за
  interaction; focus повертається через transition `onExited`.
- Команда регресійної перевірки та результат:
  `npx nx test admin-products-feature` і
  `npx nx typecheck-tests admin-products-feature` — пройшли.

## Контрольна точка

Жодне фото не видаляється без confirm; server conflict ніколи не прибирає
картку або не повідомляється як успіх.
