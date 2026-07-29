# Як доручити AI створити коміти

Надішліть AI це повідомлення:

```text
Працюй за регламентом `docs/specs/_templates/git/git-commit-batching.md`.
Створи логічні коміти лише з таких змін: `<опишіть зміни або вкажіть шляхи>`.
Не виконуй push і не створюй PR.
```

Приклад для усіх незакомічених змін:

```text
Працюй за регламентом `docs/specs/_templates/git/git-commit-batching.md`.
Створи логічні коміти з усіх моїх поточних незакомічених змін.
Не виконуй push і не створюй PR.
```

Приклад для частини змін:

```text
Працюй за регламентом `docs/specs/_templates/git/git-commit-batching.md`.
Створи коміти лише зі змін у `libs/admin/catalog` і `docs/specs/admin/catalog/002-product-archive`.
Не включай інші файли, не виконуй push і не створюй PR.
```
