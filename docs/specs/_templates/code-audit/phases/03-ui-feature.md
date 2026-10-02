# Фаза 03 — UI та feature orchestration

1. Перевірте pages, containers, forms, tables, dialogs, details і states.
2. Відокремте orchestration від presentation за typed props/callback contracts.
3. Перенесіть pure rules до model, reusable domain presentation до domain `ui`.
4. Перевірте routing, browser adapters, accessibility і незалежні lifecycle.
5. Запишіть причину кожного split і кожного рішення залишити код цілісним.

**Checkpoint:** presentation не володіє API/router/server state, а feature не
містить reusable form/table/details implementation без обґрунтування.
