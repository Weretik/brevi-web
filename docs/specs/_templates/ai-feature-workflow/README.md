# Процес AI для функціональності

Це точка входу для реалізації погодженої frontend feature.

1. Прочитай усі applicable `AGENTS.md`, feature `README.md`, requirements,
   design/contracts, tasks і traceability.
2. Визнач дозволений scope: feature, phase, `SC-*` або `TS-*`/`EN-*`.
3. Перевір ready tasks і фактичний test tooling.
4. Виконай architecture baseline і code audit; для наявних системних порушень
   підключи [remediation SDD](../remediation/README.md).
5. Виконай [context and scope](01-context-and-scope.md),
   [tasks and evidence](02-execution-and-evidence.md), потім
   [verification and handoff](03-verification-and-handoff.md).

Якщо scope охоплює кілька tasks, переходь між усіма ready tasks за dependencies
без окремої команди користувача.
