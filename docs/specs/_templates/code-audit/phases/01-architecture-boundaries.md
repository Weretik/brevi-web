# Фаза 01 — Projects, layers і module boundaries

1. Побудуйте матрицю `project → role → tags → allowed dependencies`.
2. Порівняйте її з фактичними `project.json`, aliases і `depConstraints`.
3. Перевірте, що кожна наявна відповідальність має правильний layer/owner.
4. Створіть tasks для відсутніх projects/layers і для виправлення constraints.
5. Доведіть, що documented imports дозволені, а reverse imports блокуються.

**Checkpoint:** target dependency direction можна реалізувати й перевірити lint,
а кожна розбіжність має `AF-*` та task.
