# Фаза 05 — Test tooling і regression safety

1. Перевірте targets, configs і executable test files кожного affected project.
2. Підтвердьте окремий source/test typecheck або еквівалентне повне охоплення.
3. До moves визначте characterization tests для observable behavior.
4. Для кожної remediation task запишіть focused і affected regression commands.
5. Не вважайте installed dependency або `--passWithNoTests` evidence.

**Checkpoint:** кожен move/tool migration має executable safety net, а tests
компілюються й запускаються через реальні Nx targets.
