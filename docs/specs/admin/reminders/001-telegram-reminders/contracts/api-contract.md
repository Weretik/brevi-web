# Контракт споживача: Нагадування

- **Канонічний OpenAPI:** `docs/sdd/contracts/reminders/telegram-reminders.openapi.yaml` у
  `https://github.com/Weretik/BreviERP.git`, коміт `cc7629de24a09333f644eea77ba51fb1363468c7`
  (`master` після злиття PR #8).
- **Знімок:** `docs/contracts/openapi/backend/reminders/`, типи в `@admin/shared/contracts`.

| operationId                 | Використання в адмінці                                  | Кеш                                  |
| --------------------------- | ------------------------------------------------------- | ------------------------------------ |
| getReminderTasks            | Таблиця «Задачі»                                        | надає `ReminderTask`                 |
| createReminderTask          | Діалог «Нова задача»                                    | інвалідує задачі                     |
| updateReminderTask          | Діалог редагування                                      | інвалідує задачі й періоди           |
| archiveReminderTask         | «Видалити» (м'яке видалення, історія лишається)         | інвалідує задачі й періоди           |
| previewReminderDueDates     | Три найближчі терміни у формі                           | надає `ReminderTask`                 |
| assignReminderChat          | «Призначити задачам» на сторінці чатів                  | інвалідує задачі                     |
| getReminderOccurrences      | «Періоди», метрики (`status=open`, `pageSize=200`)      | надає `ReminderOccurrence`           |
| closeReminderOccurrence     | Кнопка «Виконано»                                       | інвалідує періоди                    |
| reopenReminderOccurrence    | Кнопка «Відкрити»                                       | інвалідує періоди                    |
| getReminderChats            | «Чати Telegram», вибір чату у формі (лише підтверджені) | надає `ReminderChat`                 |
| updateReminderChat          | Підтвердження й назва чату                              | інвалідує чати й задачі (назва чату) |
| sendReminderChatTest        | Кнопка «Тест»                                           | —                                    |
| connectTelegramWebhook      | «Підключити бота»                                       | —                                    |
| getReminderNonWorkingDays   | «Неробочі дні»                                          | надає `ReminderNonWorkingDay`        |
| addReminderNonWorkingDay    | Форма «Додати»                                          | інвалідує дні, задачі, періоди       |
| removeReminderNonWorkingDay | «Прибрати»                                              | інвалідує дні, задачі, періоди       |

Згенеровані схеми Swashbuckle мають усі поля необов'язковими, тому
`data-access/src/mappers` перевіряють кожне поле під час виконання (коди,
ISO-дати, цілі числа) і повертають моделі `@admin/reminders/model`.
Помилки: 400 — «Перевірте введені дані», 404 — запис не знайдено, 409 —
причина з бекенду. Повторів і скасувань немає; пагінація лише в періодах
(серверна, `page` від 1).
