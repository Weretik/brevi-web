# Admin: Налаштування ШІ

**Status:** implemented 2026-11-05 with stage 3 of «Рахунки на закупку». Backend decisions are in the BreviERP specification `docs/sdd/specs/ai/001-ai-settings`; the consumed contract is [backend/ai](../../contracts/openapi/backend/ai/ai-settings.openapi.yaml).

`/admin/ai` («Адміністрування → Налаштування ШІ») is visible to Admin only (backend policy `RequireAdminRole`). The page has:

- «Ключ OpenAI»: the key is write-only. The page shows only its last 4 characters; «Зберегти ключ» replaces it, «Видалити ключ» asks first and switches the AI off.
- «Моделі»: the switch «ШІ увімкнено» (cannot be on without a key), the fast and the strong model with their prices per 1M input/output tokens, «Перевірити» per model (a tiny request that works while the AI is off) and the monthly limit in dollars.
- «Витрати цього місяця»: requests, tokens and dollars; a warning only when the limit is reached.
- «Умови розпізнавання рахунків»: extra rules up to 4000 characters, appended to the fixed recognition instruction of the backend.

Saves send the version the user opened; a newer change by someone else comes back as the backend reason.

## Code structure

```text
libs/admin/ai/
├── model/src/entities/ai-settings.ts                 # settings, usage, prompt, input, test result
├── model/src/forms/ai-settings-form.ts               # form values ↔ request (comma decimals)
├── model/src/validators/ai-settings-validation.ts    # models, prices, limit, key shape
├── data-access/src/api/ai-api.ts                     # GET/PUT settings, PUT/DELETE key, PUT prompt, POST test
├── data-access/src/validators/ai-response.ts         # runtime response checks
├── data-access/src/mappers/ai-settings.mapper.ts     # response → model
├── data-access/src/errors/ai-api-error.ts            # keeps backend reasons
└── feature/src/
    ├── pages/ai-settings-page.tsx                    # the page
    ├── components/ai-{key,models,usage,prompt}-section.tsx
    ├── hooks/use-ai-settings.ts
    └── ai.routes.tsx                                 # /admin/ai
apps/admin-react/src/app/router/{create-admin-router.tsx,legacy-menu.ts}   # Admin-only route and menu item
```

## Tests

`npx nx test admin-ai-feature`, `admin-ai-data-access`, `admin-ai-model`:

- `feature/src/pages/ai-settings-page.component.test.tsx` — masked key, save and test, limit warning;
- `data-access/src/mappers/ai-settings.mapper.unit.test.ts`, `model/src/validators/ai-settings-validation.unit.test.ts`;
- `apps/admin-react/src/app/router/navigation-config.unit.test.ts` — the menu item only for Admin.
