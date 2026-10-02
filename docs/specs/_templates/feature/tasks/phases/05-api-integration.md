# Фаза 05 — Планування інтеграції з API

До endpoint-коду заповніть `contracts/api-contract.md`: `operationId`, джерело
OpenAPI та версію backend. Відсутні sync/generate/check оформіть як `EN-*`.
Створюйте невеликі задачі для синхронізації контракту, generated types,
валідації відповіді, мапінгу, скасування, кешу та помилок. DTO залишаються на
межі data-access; сфокусовані тести перевіряють клієнтські рішення.

Перевірте фактичний API client/base API та спосіб оголошення endpoint. Не
додавайте паралельний direct-fetch transport, якщо standards визначають RTK
Query. Generated DTO не експортуються як domain/view model; public barrel не
розкриває transport helpers, parsers або private mappers.

**Контрольна точка:** кожна мережева поведінка пов'язана з погодженим контрактом
і видимим користувачу результатом, який можна протестувати.
