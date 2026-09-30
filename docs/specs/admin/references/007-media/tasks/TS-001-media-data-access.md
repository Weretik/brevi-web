# TS-001 — Media model, mapping і transport

- **ID задачі:** TS-001
- **Охоплює:** SC-001, SC-002, SC-004–SC-008
- **Залежить від:** EN-001
- **Точні шляхи:** `libs/admin/products/data-access/src/product-lookups.api.ts`,
  `products.mapper.ts`, `products.model.ts`, `src/index.ts` або погоджений
  `src/catalog-media/`; focused `*.unit.test.ts` і `*.integration.test.ts`
- **Рівень тестування:** модульний і фокусний інтеграційний

## Робота

- [x] Зберегти один public transport owner для GET/POST/DELETE catalog media та
      використати generated operation types.
- [x] Runtime-перевіряти list/upload payload і мапити лише потрібну UI-модель;
      нормалізувати network/400/401/403/404/409 без покладання на випадковий текст.
- [x] Додати чисту case-insensitive filename filter з детермінованою locale
      поведінкою.
- [x] Не встановлювати `Content-Type` вручну для multipart, передавати
      `AbortSignal` read і не робити automatic retry для mutations.
- [x] Перевірити `product-lookups.api.ts`/mapper на цілісність; виділити
      `catalog-media/` лише якщо media lifecycle став незалежною складною роллю,
      зберігши public imports product form.
- [x] Записати рішення та повторні tests у `code-audit/audit.md`.

## Свідчення

- Шлях або назва фокусного тесту: `catalog-media.mapper.unit.test.ts`,
  `catalog-media.api.integration.test.ts` або відповідні тести біля наявних файлів.
- Команда Red та очікувана поведінкова помилка:
  `npx nx test admin-products-data-access -- catalog-media` — відсутні
  delete/error/filter contracts.
- Фактичний Red: 4 failures — `storageKey` виходив у UI, multipart мав поле
  `File`, delete був відсутній, filename filter був відсутній.
- Команда Green і результат: focused Vitest — 4/4; full suite — 15/15.
- Примітка про повторний code audit: media transport і mapper винесено у
  `catalog-media.api.ts`/`catalog-media.mapper.ts`, бо повний GET/POST/DELETE
  lifecycle є незалежним від categories lookup; filename search перенесено до
  feature model.
- Команда регресійної перевірки та результат:
  `npx nx test admin-products-data-access` і
  `npx nx typecheck admin-products-data-access` — 14/14 і typecheck пройшли.

## Контрольна точка

Feature отримує валідовану media модель та типізовані GET/POST/DELETE outcomes,
а product form продовжує використовувати той самий transport.
