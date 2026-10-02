# TS-005 — Permission policy boundary

- **ID задачі:** TS-005
- **Охоплює:** SC-008
- **Залежить від:** EN-002, TS-003
- **Точні шляхи:** `libs/admin/core/permissions/`, `tsconfig.base.json`, first
  route/action consumer named by EN-002
- **Рівень тестування:** модульний + інтеграційний

## Робота

**Delivery decision:** deferred / not required. Backend `/me` contract містить
roles, але не permissions; user дозволив завершити feature без permissions.
Жоден checkbox нижче не виконується в цій delivery, щоб не вигадувати policy.

- [ ] Створити project/alias/targets тільки разом із потрібними
      `policies`, `guards` або `hooks`; не копіювати lone `.babelrc`.
- [ ] Red: pure allow/deny policy tests, unknown-input deny test і first
      consumer integration test.
- [ ] Реалізувати лише погоджені identifiers/source/consumer; UI check не
      замінює backend authorization.
- [ ] Public API не експортує internal parsing або mutable session state.
- [ ] Перевірити Nx boundaries, no domain dependency, responsibilities і audit.

## Свідчення

- Фокусні тести: exact paths визначає EN-002.
- Команда Red: `npx nx test admin-core-permissions`.
- Команда Green: та сама після implementation.
- Refactor: повторний focused test.
- Регресія: permissions + first consumer lint/typecheck/tests.

## Контрольна точка

Library має хоча б одну реальну policy і consumer, unknown input fails closed,
а backend enforcement задокументовано й перевірено контрактом.
