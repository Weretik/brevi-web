# Фаза 04 — Public API, imports і вкладеність

1. Перевірте root `src/index.ts`, aliases і всі cross-library imports.
2. Закрийте private DTO/mappers/parsers/transport helpers/internal components.
3. Для кожного загального каталогу (`components`, `hooks`, `pages`,
   `collections`) порахуйте production-файли та визначте незалежні flows.
   Каталог із `>= 8` файлами потребує записаного рішення `split/keep`; два або
   більше flows/resources у ньому потрібно розкласти за capability/module
   всередині ролі: `pages/<module>`, `components/<module>`, `hooks/<module>`.
   Page/component/hook test залишається поруч із відповідним production-файлом.
4. Згрупуйте внутрішні файли за фактичними ролями всередині capability, якщо
   додаткова рольова вкладеність справді потрібна.
5. Знайдіть cycles, duplicate owners, stale compatibility files, empty folders,
   dead aliases/exports і застарілі exact paths у docs.
6. Повторіть project graph і boundary lint після moves.

## Цільова схема для перевірки `feature`

```text
libs/admin/<domain>/feature/src/
├── pages/
│   └── <module>/
│       ├── <page>.tsx
│       └── <page>.component.test.tsx
├── components/
│   └── <module>/
│       ├── <component>.tsx
│       └── <component>.component.test.tsx
├── hooks/
│   └── <module>/
│       ├── use-<behavior>.ts
│       └── use-<behavior>.unit.test.tsx
├── model/
│   └── <module>/
├── state/
│   └── <module>/
└── index.ts
```

Аудит має порівняти фактичне дерево з цією схемою, зафіксувати потрібні
`move/split/keep/delete` і виконати погоджені переміщення. `model` та `state`
не створюються порожніми.

**Checkpoint:** фізичне дерево й public contracts відповідають target matrix;
заборонені deep imports/exports відсутні.
