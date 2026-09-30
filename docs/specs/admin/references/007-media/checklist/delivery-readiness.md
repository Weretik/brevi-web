# Готовність до постачання — Медіа/Фото

- [x] EN-001 виконано; snapshot/generated types походять з нового pinned commit.
- [x] Усі сценарії мають статус `verified` або документований deferred.
- [ ] TS-002–TS-004 не мають валідного виконаного Red: тести написано першими,
      але початковий запуск зупинився на некоректному icon import.
- [x] Contract, implementation і documentation узгоджені.
- [x] `npm run contracts:check` і focused mapping/error tests пройшли.
- [x] `code-audit/audit.md` завершено після реалізації й повторних перевірок.
- [x] Lint/typecheck/test для affected projects та `npx nx build admin-react` пройшли.
- [x] Критичний `media.spec.ts` journey пройшов; responsive/theme/focus ризики
      мають автоматичні або обґрунтовані manual evidence.
- [x] Змінені файли, неперевірені елементи й залишкові ризики наведені у звіті.

Deferred: SC-008 endpoint authorization до впровадження спільної React Admin
auth/session boundary. Backend media endpoints досі `AllowAnonymous`.
