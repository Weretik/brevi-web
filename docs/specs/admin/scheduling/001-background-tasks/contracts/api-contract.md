# Контракт споживача: Фонові задачі

- **Канонічний OpenAPI:** `docs/sdd/contracts/scheduling/background-tasks.openapi.yaml` у
  `https://github.com/Weretik/BreviERP.git`, коміт `c522dac57ce94c0295dff0565271d2b2a57c01fe` (PR #176).
- **Знімок:** `docs/contracts/openapi/backend/scheduling/`, типи в `@admin/shared/contracts`.

| operationId                 | Використання в адмінці              | Кеш                                |
| --------------------------- | ----------------------------------- | ---------------------------------- |
| getScheduledTasks           | Таблиця задач; оновлення кожні 30 с | надає `ScheduledTask`              |
| getScheduledTaskRuns        | «Історія запусків» у бічній панелі  | надає `ScheduledTaskRun` за ключем |
| updateScheduledTaskSchedule | «Змінити розклад» → «Зберегти»      | інвалідує задачі                   |
| runScheduledTaskNow         | «Запустити зараз»                   | інвалідує задачі й історію         |

`data-access/src/mappers` перевіряють кожне поле під час виконання й повертають моделі
`@admin/scheduling/model`. Помилки: 400 — причина з бекенду або «Перевірте розклад», 403 — немає
прав, 404 — задачі немає, 409 — причина з бекенду («Задача вже виконується», «Запуск уже
заплановано»). Повторів і скасувань немає, пагінації немає.
