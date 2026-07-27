# Робочий контекст AI: Admin (React)

Прочитай цей файл перед нетривіальною зміною в `apps/admin` або `libs/admin`. Пов'язані документи є джерелом істини.

1. Почни з [архітектури Admin](../architecture/admin/README.md): домени, залежності, Nx-контракт, стан і API.
2. Обов'язково прочитай [стандарт організації коду Admin](../standards/admin-code-organization.md). Зверни особливу увагу на декомпозицію, одну відповідальність модуля та структуру внутрішнього коду; це правило діє для будь-якої library, feature і компонента.
3. Для UI-змін прочитай [стандарт інтерфейсу Admin](../standards/admin-ui.md).
4. Перед нетривіальною можливістю або архітектурною зміною прочитай [SDD-процес Admin](../architecture/admin/sdd-process.md), створи чи онови специфікацію в `docs/specs/admin/<domain>/` і, за потреби, використай [шаблон поетапної реалізації](../specs/_templates/admin-feature-phased-implementation.md).

Зберігай межі `feature`, `ui`, `data-access` і `model`, DTO залишай у `data-access`, а публічний API бібліотек — у `src/index.ts`. Запускай релевантні lint, tests і build та фіксуй точні результати.
