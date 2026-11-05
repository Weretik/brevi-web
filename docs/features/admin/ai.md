# Admin: Налаштування ШІ

**Status:** implemented 2026-11-05 with stage 3 of «Рахунки на закупку». Backend decisions are in the BreviERP specification `docs/sdd/specs/ai/001-ai-settings`; the consumed contract is [backend/ai](../../contracts/openapi/backend/ai/ai-settings.openapi.yaml).

`/admin/ai` («Адміністрування → Налаштування ШІ») is visible to Admin only (backend policy `RequireAdminRole`). Layout chosen 2026-11-05 (variant A of the [UX review](https://claude.ai/artifact/4WYATYfV17vhvFy68BqYJ1)): a state strip on top, then cards that each save themselves next to their fields.

- State strip: «Працює» or «Не працює» with the reason (no key, switched off, monthly limit reached) and where to fix it; the key's last 4 characters; this month's spending against the limit; requests and tokens.
- «Робота ШІ»: the switch saves at once (cannot be on without a key); «Ліміт на місяць» has its own «Зберегти ліміт», highlighted while the value differs from the saved one.
- «Ключ OpenAI»: write-only; «Зберегти ключ» / «Замінити ключ», «Видалити ключ» asks first and switches the AI off.
- «Моделі й ціни»: a read-only table (what the model is for, name, $ per 1M input/output tokens) with «Перевірити» per model (works while the AI is off); «Змінити» opens the side panel to edit them.
- «Умови розпізнавання рахунків»: optional extra rules up to 4000 characters, appended to the fixed recognition instruction.

Each card shows its own result under its fields. Saves send the version the user opened; a newer change by someone else comes back as the backend reason.

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
    ├── components/ai-status-strip.tsx                # state, key, spending, the reason it does not work
    ├── components/ai-{work,key,models,prompt}-section.tsx
    ├── components/ai-models-drawer.tsx               # side panel: models and prices
    ├── hooks/use-ai-settings.ts
    └── ai.routes.tsx                                 # /admin/ai
apps/admin-react/src/app/router/{create-admin-router.tsx,legacy-menu.ts}   # Admin-only route and menu item
```

## Tests

`npx nx test admin-ai-feature`, `admin-ai-data-access`, `admin-ai-model`:

- `feature/src/pages/ai-settings-page.component.test.tsx` — reason when it does not work, masked key, switch saved at once, limit with its own button, model check, side panel prices, reached limit;
- `data-access/src/mappers/ai-settings.mapper.unit.test.ts`, `model/src/validators/ai-settings-validation.unit.test.ts`;
- `apps/admin-react/src/app/router/navigation-config.unit.test.ts` — the menu item only for Admin.
