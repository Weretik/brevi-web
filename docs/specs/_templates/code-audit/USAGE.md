# Запит для повного архітектурного аудиту

```text
Працюй за `docs/specs/_templates/code-audit/` і виконай усі фази 00–06.
Feature/SDD: `<точний шлях>`.
Scope: `<точні projects/libraries/files і залежності>`.

Порівняй фактичний код із applicable architecture/standards, а не лише із
сусідніми файлами. Перевір Nx projects, tags і depConstraints; domain layers і
вкладеність; public index.ts/aliases/barrels; approved state/API stack;
відсутність direct fetch/manual server cache, якщо потрібен RTK Query; DTO та
mapper boundary; UI/feature orchestration; tests і typecheck-tests; порожні,
мертві й дубльовані модулі. Для кожного `components/hooks/pages/collections`
порахуй production-файли й flows: при `>= 8` файлах зафіксуй `split/keep`, а
при `>= 2` незалежних flows/resources створи capability-підкаталоги та розмісти
їх усередині role-каталогів (`pages/<module>`, `components/<module>`,
`hooks/<module>`); test залиш поруч із файлом відповідного test level.

Створи AF-* для кожної розбіжності та зв'яжи її з TS-*/EN-* або RM-* у
remediation SDD. Виправ усі findings у дозволеному scope, повторюй focused
checks після кожної структурної задачі й не завершуй delivery зі статусом open,
blocked або planned. Для системних findings спочатку створи/використай
`docs/specs/_templates/remediation/`.
```

## Лише діагностика

Якщо користувач явно просить тільки звіт, заповніть inventory, матриці та
`AF-*`, але не змінюйте implementation. Такий аудит має статус `blocked`, доки
findings не отримають погоджений remediation scope; його не можна подавати як
delivery checkpoint.
