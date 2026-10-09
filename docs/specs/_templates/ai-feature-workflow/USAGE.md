# Реалізувати прийняту feature

## Один агент

```text
$brevi-feature-delivery

Feature: `docs/specs/<surface>/<domain>/<NNN>-<feature-slug>/`.
Scope: <уся feature | phase | SC-* | TS-* | EN-*>.
Коміти: <не створюй | atomic>.
Не виконуй push і не створюй PR.
```

## Кілька агентів

```text
$brevi-feature-orchestrator

Feature: `docs/specs/<surface>/<domain>/<NNN>-<feature-slug>/`.
Scope: <уся feature | phase | SC-* | TS-* | EN-*>.
Коміти: <не створюй | atomic>.
Не виконуй push і не створюй PR.
```

## Продовжити

```text
$brevi-feature-delivery

Продовжуй feature: `docs/specs/<surface>/<domain>/<NNN>-<feature-slug>/`.
Scope: <точний scope>.
Не повторюй завершені tasks.
```
