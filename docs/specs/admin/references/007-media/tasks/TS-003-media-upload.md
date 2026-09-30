# TS-003 — Upload одного фото

- **ID задачі:** TS-003
- **Охоплює:** SC-004, SC-005
- **Залежить від:** TS-001, TS-002
- **Точні шляхи:** `libs/admin/products/feature/src/components/media/media-upload.tsx`,
  за потреби `src/hooks/use-media-upload.ts` і
  `src/model/media-file-validation.ts`, focused component/unit tests
- **Рівень тестування:** компонентний і модульний

## Робота

- [x] Додати один file picker із server-aligned accept/size validation,
      filename, busy/disabled state й доступними success/error messages.
- [x] Після успіху інвалідовувати/read список; показувати server processing
      status без нескінченного polling і без автоматичного mutation retry.
- [x] Після помилки зберігати галерею й дозволяти новий вибір; очищати native
      input так, щоб той самий файл можна було вибрати повторно.
- [x] Не дублювати file rules із product upload: виділити чисту reusable
      validation лише якщо обидва споживачі мають однаковий контракт.
- [x] Перевірити component/hook/model responsibilities і записати рішення в
      `code-audit/audit.md`.

## Свідчення

- Шлях або назва фокусного тесту: `media-upload.component.test.tsx`, за потреби
  `media-file-validation.unit.test.ts`.
- Команда Red та очікувана поведінкова помилка:
  `npx nx test admin-products-feature -- media-upload` — interaction відсутня.
- Фактичний Red не зафіксовано окремо від спільного page test через початковий
  блокер icon import; це process deviation, а не Green evidence.
- Команда Green і результат: page component test проходить valid,
  client-invalid і success-refresh; transport suite перевіряє server error.
- Примітка про рефакторинг: правила файлу винесено у чистий
  `media-file-validation.ts`, mutation lifecycle — у `use-media-upload.ts`.
- Команда регресійної перевірки та результат:
  `npx nx test admin-products-feature` і
  `npx nx typecheck admin-products-feature` — пройшли.

## Контрольна точка

Один допустимий файл можна завантажити лише одним активним submit; усі outcomes
дають видимий результат і не псують галерею.
