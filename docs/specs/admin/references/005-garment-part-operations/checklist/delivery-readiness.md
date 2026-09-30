# Операції (роботи) — готовність до постачання

- [x] SC-001–SC-005 verified за traceability.
- [x] Contract SHA `9f75e832525ea96a327be227f6ec756e01ddfa67`, operationId, provenance, generated types і runtime validation перевірені.
- [ ] Green/Refactor/Regression записані по TS-001–TS-005; виконуваний behavioral Red отримано для TS-001. Для TS-002–TS-005 окремий Red перед реалізацією не зафіксовано; це відхилення від TDD workflow.
- [x] Створення, перегляд, редагування, одиночне/масове видалення з підтвердженням перевірені; вигаданих дій немає.
- [x] Relevant lint/typecheck/test, `npx nx build admin-react`, `npx nx e2e admin-react-e2e`, `contracts:sync/generate/check` пройшли.
- [x] Теми, keyboard/focus через MUI й Playwright journey, 320/768/1280 px і відповідальність файлів перевірені.

## Залишковий ризик

- Поведінкові тести UI та маршруту пройшли, але історичний Red етап TS-002–TS-005 відтворити як тест, запущений **до** реалізації, неможливо. Відхилення записано в task evidence; воно не означає невдалу поточну регресію.
- Backend і frontend треба постачати разом: frontend snapshot прив'язаний до зазначеного backend commit.
- Паралельний прогін E2E/lint/component suite дав 16 timeout-ів у різних довідниках через ліміт 5 с; той самий `npx nx test admin-references-feature` окремо пройшов 29/29 після додавання unit тесту валідації.
