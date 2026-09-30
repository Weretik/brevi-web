# Постачальники — готовність до постачання

- [x] SC-001–SC-005 verified з mock API у component/integration/browser tests.
- [x] Contract SHA, operationId, snapshot provenance, generated types і runtime validation перевірені.
- [x] Evidence записано по кожній TS-*; первинний Red для field error у TS-003 і окремий запуск Red для TS-005 не фіксувалися, це вказано в task-файлах.
- [x] Створення, перегляд, редагування, одиночне й bulk видалення підтверджені; вигаданих controls немає.
- [x] Relevant lint/typecheck/test, `npx nx build admin-react`, `npx nx e2e admin-react-e2e` та contract scripts пройшли.
- [x] Browser перевірив теми, keyboard/focus, 320/768/1280 px; відповідальності описані в `code-audit/audit.md`.

Живий backend API не використовувався в browser acceptance; mock відповідав pinned OpenAPI. Звичайний E2E на `4300` підхопив попередній dev server зі старим alias і впав до рендеру; повтор на production preview `4311` пройшов 7/7.
