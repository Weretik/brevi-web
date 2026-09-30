# Фурнітура виробу — готовність до постачання

- [x] SC-001–SC-005 verified через data-access, component, app integration та browser E2E.
- [x] Contract SHA, operationId, snapshot provenance, generated types і runtime validation перевірені.
- [x] Red/Green/Refactor/Regression evidence записані по TS-001–TS-005.
- [x] Старі дії фурнітури відтворені; дії тканин чекають SDD 003, нових вигаданих дій немає.
- [x] Relevant lint/typecheck/test, `npx nx build admin-react`, `npx nx e2e admin-react-e2e` та contract scripts пройшли.
- [x] Теми, keyboard/focus, 320/768/1280 px та відповідальність змінених файлів перевірені.

Залишковий ризик: контракт перевірено за backend controller/validator і генерацією; live backend integration не виконувалася. Поточний backend повертає 404 для порожньої колекції, тому frontend нормалізує саме collection GET 404 до порожнього стану. Build має попередження про chunk понад 500 kB.
