# Правила коду Admin

## Бібліотеки та залежності

- Розміщуйте domain-код у `libs/admin/<domain>/{model,data-access,ui,feature}`.
  Не створюйте порожні бібліотеки наперед, але щойно відповідальність існує,
  вона повинна мати визначеного власника: domain types/invariants — `model`,
  transport/cache — `data-access`, повторно використовуване domain
  presentation — `ui`, orchestration — `feature`.
- `model` містить pure TypeScript types, query, defaults та інваріанти; він не залежить від React, HTTP або browser API.
- `data-access` володіє private DTO, mapper та RTK Query hooks; він не містить JSX, router або feature-local state.
- `ui` містить presentational components, forms, tables і states; він не викликає API або router.
- `feature` оркеструє page, hooks і локальний UI-state; він передає domain data та callbacks у `ui`.
- Між libraries імпортуйте тільки через alias і public `src/index.ts`; deep
  imports і aliases безпосередньо на внутрішній файл заборонені. Додатковий
  entry point дозволений лише як окремий задокументований public contract із
  власною перевіркою меж, а не як обхід кореневого `index.ts`.
- Public API експортує лише контракти для споживачів. Transport helpers,
  private DTO adapters, response parsers і внутрішні mappers не експортуються.
- Nx tags і `depConstraints` повинні реалізовувати той самий напрям залежностей,
  що й документація. Новий шар не вважається створеним, доки lint реально
  дозволяє правильні й забороняє зворотні залежності.

## Структура та стан

- Один файл, компонент і каталог має одну цілісну відповідальність.
- Групуйте внутрішній код за роллю: `components`, `pages`, `hooks`, `state`, `forms`, `tables`, `mappers`, `contracts`.
- У `feature` спочатку використовуйте рольові каталоги `pages`, `components`,
  `hooks`, `model`, `state`. Якщо рольовий каталог містить два або більше
  незалежних flows/resources (наприклад list, editor, detail і media), створіть
  у ньому capability-підкаталоги: `pages/product-list`,
  `components/product-list`, `hooks/product-list`. Test розміщується поруч із
  файлом свого рівня: page test біля page, hook test біля hook. Вісім і більше
  production-файлів у рольовому каталозі — обов'язковий сигнал для
  зафіксованого рішення `split/keep` в code audit.

### Цільова схема `feature`

```text
libs/admin/<domain>/feature/src/
├── pages/
│   ├── <module-a>/
│   │   ├── <page>.tsx
│   │   └── <page>.component.test.tsx
│   └── <module-b>/
├── components/
│   ├── <module-a>/
│   │   ├── <component>.tsx
│   │   └── <component>.component.test.tsx
│   └── <module-b>/
├── hooks/
│   ├── <module-a>/
│   │   ├── use-<behavior>.ts
│   │   └── use-<behavior>.unit.test.tsx
│   └── <module-b>/
├── model/
│   └── <module>/
├── state/
│   └── <module>/
└── index.ts
```

Порядок вкладеності обов'язковий: спочатку роль, потім module/capability.
Каталоги `model` і `state` створюйте лише за наявності відповідної
відповідальності. Test завжди залишається поруч із production-файлом того
самого рівня.

- Не створюйте звалищні каталоги або назви: `common`, `misc`, `helpers`, `utils`, `types` без доменного призначення.
- Server data, loading і API errors належать RTK Query; не дублюйте їх у reducer.
- Простий feature-local state зберігайте в component state; reducer створюйте лише для пов'язаних переходів або shared feature state.
- Не виконуйте HTTP і не ховайте business rules у JSX.

## Сторінки та маршрути

- Page є оркестратором; toolbar, table, complex cell і feature-only dialog розділяйте за незалежною відповідальністю.
- Reusable dialog/form належить `ui` і отримує values, errors та callbacks через props.
- Route, guards, global store і theme не змінюйте без явного scope feature.
