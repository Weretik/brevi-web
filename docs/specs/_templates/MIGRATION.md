# Поступова міграція до SDD від сценаріїв

1. Збережіть завершені task IDs, phase files і фактичне evidence.
2. Дайте `R-*` та `SC-*` новій або зміненій поведінці. Незмінені сценарії можна
   ідентифікувати без редакційного переписування.
3. Додайте `traceability.md` для changed scope і regression dependencies.
4. Залиште великі legacy phases як historical/orchestration files.
5. Перетворіть лише незавершену роботу на малі `TS-*`/`EN-*` task-файли.
6. Застосуйте Red → Green → Refactor → Regression до нового behavior.

Full migration означає mapping усіх актуальних сценаріїв, але не дає підстав
перенумеровувати завершені задачі чи переписувати старі command results.
