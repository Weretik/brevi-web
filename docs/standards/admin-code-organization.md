# Admin code rules

## Libraries and dependencies

- Розміщуйте domain-код у `libs/admin/<domain>/{model,data-access,ui,feature}`.
- `model` містить pure TypeScript types, query, defaults та інваріанти; він не залежить від React, HTTP або browser API.
- `data-access` володіє private DTO, mapper та RTK Query hooks; він не містить JSX, router або feature-local state.
- `ui` містить presentational components, forms, tables і states; він не викликає API або router.
- `feature` оркеструє page, hooks і локальний UI-state; він передає domain data та callbacks у `ui`.
- Між libraries імпортуйте тільки через alias і public `src/index.ts`; deep imports заборонені.

## Structure and state

- Один файл, компонент і каталог має одну цілісну відповідальність.
- Групуйте внутрішній код за роллю: `components`, `pages`, `hooks`, `state`, `forms`, `tables`, `mappers`, `contracts`.
- Не створюйте звалищні каталоги або назви: `common`, `misc`, `helpers`, `utils`, `types` без доменного призначення.
- Server data, loading і API errors належать RTK Query; не дублюйте їх у reducer.
- Простий feature-local state зберігайте в component state; reducer створюйте лише для пов'язаних переходів або shared feature state.
- Не виконуйте HTTP і не ховайте business rules у JSX.

## Pages and routes

- Page є оркестратором; toolbar, table, complex cell і feature-only dialog розділяйте за незалежною відповідальністю.
- Reusable dialog/form належить `ui` і отримує values, errors та callbacks через props.
- Route, guards, global store і theme не змінюйте без явного scope feature.
