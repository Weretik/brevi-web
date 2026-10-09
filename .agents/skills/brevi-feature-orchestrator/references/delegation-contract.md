# Delegation contract

Кожен packet має містити конкретні значення без placeholders:

- Packet ID і role: implementation, API, research, verification або audit.
- Source IDs: exact `SC-*`, `TS-*`, `EN-*` або `AF-*`.
- Objective: один перевірний результат.
- Inputs і completed dependencies.
- Allowed та forbidden paths.
- Deliverables і exact verification commands.
- Git mode: `none` або `atomic`; завжди `no push` і `no PR`.

Agent читає applicable `AGENTS.md` та assigned skill, не розширює scope, не редагує shared feature evidence і зупиняється при conflict або missing dependency.

Handback містить status, handled IDs, changed paths, commands/results, commit hashes за наявності, proposed evidence update, risks і blockers.
