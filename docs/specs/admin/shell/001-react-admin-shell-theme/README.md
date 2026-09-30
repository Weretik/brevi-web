# 001 — Оболонка та корпоративна тема React Admin

- **Поверхня:** React Web, `apps/admin-react`
- **Статус:** implemented — сценарії SC-001–SC-006 verified
- **Власник:** Admin
- **Оновлено:** 2026-09-26
- **API:** немає

Мета — створити спільний каркас для всіх майбутніх сторінок React Admin і
тему Brevi. `kedr-web/apps/admin` є референсом композиції React/MUI; візуальні
рішення беруться з чинного Brevi Admin, а не з палітри Kedr. Ця feature
стосується лише адміністративного застосунку, не Storefront.

## Навігація

- [Правила та приймальні сценарії](requirements/overview.md)
- [Проєктування frontend і джерела](design/frontend.md)
- [Трасування](traceability.md)
- [Граф задач](tasks/README.md)
- [Готовність специфікації](checklist/spec-readiness.md)
- [Готовність до постачання](checklist/delivery-readiness.md)
- [Як доручити реалізацію](USAGE.md)
- [Надані приклади меню та шапки](../../table-visual-guidance.md#меню-та-шапка)

Надані згодом зображення [бічного меню](../../assets/visual-references/admin-sidebar.png)
та [верхньої панелі](../../assets/visual-references/admin-top-bar.png) є
візуальними референсами для наступної SDD перенесення меню, а не свідченням,
що поточний shell уже точно повторює ці приклади.

`data-model.md` і `contracts/api-contract.md` не потрібні: у межах feature
немає доменних даних або API. Історична
[специфікація міграції шаблону](../../migration/README.md) лишається джерелом
контексту, але її записи про виконану реалізацію не підтверджують цю окрему
реалізацію shell.
