# Як виконувати «Медіа/Фото»

Використай `docs/specs/_templates/feature/` і специфікацію
`docs/specs/admin/references/007-media/`. EN-001 виконано на backend commit
`e4c1588659684f3d5174fc6dfbfd5bfbd420a6ea`; authorization deferred до
спільної React Admin auth feature.

Після синхронізації контракту виконуй задачі з `tasks/README.md` у порядку
залежностей і фіксуй Red/Green/Refactor/Regression. Збережи наявний transport
медіа в `admin-products-data-access`, Brevi MUI shell і маршрут
`/references/media`; не реалізовуй масове завантаження, масове видалення,
редагування файлів або папки.

Перед delivery checkpoint заверши `code-audit/audit.md` за окремим модулем
`docs/specs/_templates/code-audit/`.
