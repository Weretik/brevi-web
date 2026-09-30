# Тканини — готовність до постачання

- [x] Усі SC-* verified з mock API.
- [x] Contract SHA, operationId, snapshot provenance, generated types і runtime validation перевірені.
- [ ] Повний Red/Green/Refactor/Regression evidence по кожній TS-* відсутній: валідний Red зафіксовано для TS-003 guard створення, але TS-001/002/004/005 отримали тести після першої реалізації. Це процесна прогалина, зафіксована в task-файлах.
- [x] Підтверджені всі старі дії, нових недіючих controls немає.
- [x] Relevant lint/typecheck/test, `npx nx build admin-react`, `npx nx e2e admin-react-e2e` пройшли; contract scripts виконані.
- [x] Перевірені теми, клавіатура/фокус через наявний E2E shell і MUI dialogs, 320/768/1280 px та відповідальність змінених файлів у [аудиті](../code-audit/audit.md).

Живий backend не підключали: browser journey перевірений mock API. Перед production rollout потрібно smoke із backend commit `2ec6376d986eb18ace4c1b7d360c329d38405b57`.

Фінальна регресія: `contracts:check`; data-access 14/14, feature 17/17, admin-react 12/12, E2E 11/11; lint relevant projects, typecheck relevant projects і build `admin-react` успішні. `npm run docs:check` та Prettier check feature-документів успішні. Збірка попереджає про chunk понад 500 kB; це не блокує build.
