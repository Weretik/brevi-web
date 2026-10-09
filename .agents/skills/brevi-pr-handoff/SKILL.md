---
name: brevi-pr-handoff
description: 'Use when completed Brevi Web work needs a review-ready branch name, PR title, description, verification evidence, and residual-risk handoff.'
---

# Brevi PR Handoff

Підготуй точний review-ready handoff. Не створюй, не push і не merge PR без прямого запиту.

## Workflow

1. Переглянь `git status`, scoped diff, diff stat і recent log. Відокрем task changes від unrelated worktree changes.
2. Прочитай in-scope SDD, audit status і verification evidence. Якщо evidence не свіже, спочатку застосуй `$brevi-change-verification`.
3. Перевір blockers: unresolved clarifications, incomplete tasks, open in-scope `AF-*` і unverified generated output.
4. Запропонуй branch name з префіксом `codex/`, imperative PR title і description із Summary, Scope, Verification, Documentation та Residual risks.
5. Наведи exact commands/results, reviewer focus і migration/rollback notes.

## Guardrails

- Не включай secrets, локальні абсолютні paths або неперевірені claims.
- Не заявляй clean diff за наявності неврахованих змін.
- Використовуй GitHub integration лише за явним запитом створити або оновити PR.

## Example

`Use $brevi-pr-handoff to prepare a review-ready handoff for the completed Admin catalog work.`
