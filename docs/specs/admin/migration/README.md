# Міграція шаблону Admin

- **Статус:** історична, потребує узгодження з репозиторієм
- **Поверхня:** застарілий дизайн React Admin
- **Оновлено:** 2026-09-08

Фази 0–4 збережені як historical records. Їхнє evidence не переписано. Поточне
дерево не містить описаних у них React бізнес-бібліотек і сторінок.
`apps/admin-react` тепер має окрему
[оболонку та тему Brevi](../shell/001-react-admin-shell-theme/README.md),
але це не підтверджує історичні записи про виконання фаз. `EN-001` лишається
потрібним для узгодження решти реалізації.

## Навігація

- [Канонічні правила та сценарії](requirements.md)
- [Застаріла специфікація оркестрації](template-migration.md)
- [Трасування](traceability.md)
- [Задача узгодження](tasks/EN-001-reconcile-implementation.md)
- [Історичні фази](phases/template-migration-phase-0.md)

Customers, orders, auth і account із legacy roadmap потребують окремих feature
specifications і не входять до цієї міграції.
