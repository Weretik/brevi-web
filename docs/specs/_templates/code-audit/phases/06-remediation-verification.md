# Фаза 06 — Remediation та delivery gate

1. Виконуйте tasks за dependencies; після кожної повторюйте focused checks.
2. Оновлюйте `AF-*` лише з exact changed paths і evidence.
3. Після останньої зміни повторіть inventory, forbidden searches, graph,
   lint/typecheck/typecheck-tests/tests/contracts/build.
4. Оновіть stale docs, traceability і delivery checklist.
5. Не завершуйте checkpoint з `open`, `blocked` або `planned` finding у scope.

**Checkpoint:** усі in-scope findings `verified`; target architecture підтверджена
фактичним деревом, imports, tooling і regression evidence.
