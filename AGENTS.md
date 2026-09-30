# AGENTS.md

## Project Context

- Stack: Nx frontend monorepo with Angular apps and a React Web bootstrap.
- Package manager: use the one already configured in the repo (`npm` / `pnpm` / `yarn`)
- This repository contains only the frontend application.
- Follow the existing project structure and naming conventions.
- Do not introduce new architectural patterns unless explicitly requested.

## Goals for Codex

- Make the smallest possible change that solves the task.
- Preserve existing UI behavior unless the task explicitly requires changing it.
- Reuse existing services, utilities, components, and state mechanisms before creating new ones.
- For non-trivial changes: plan briefly -> implement -> verify -> report risks.

## Frontend Architecture Rules

- Keep business logic out of components whenever possible.
- Components should focus on presentation, interaction binding, and orchestration.
- Put API access in dedicated services/data-access layers, not directly in components.
- Put reusable UI into shared/presentational components only when reuse is clear.
- Respect existing boundaries such as `core`, `shared`, `features`, `ui`, `data-access`, `util` if they already exist in the project.
- Do not move files or reorganize folders unless required for the task.

## Framework Conventions

- Prefer the existing project style for the app being changed. Do not mix
  Angular and React paradigms or move behavior between apps without explicit scope.
- If the project already uses standalone components, continue using standalone components.
- If the project already uses Signals, continue with Signals; if it uses RxJS/store/facades, follow that approach.
- Do not introduce a new state management library without explicit request.
- Use strict typing. Avoid `any` unless there is no practical alternative, and justify it in the final report.
- Keep templates simple; avoid complex inline expressions and duplicated logic.
- HTTP calls must go through services, facades, or data-access abstractions already used in the project.
- Avoid direct DOM manipulation unless there is no Angular-native alternative.
- Respect existing routing, guards, resolvers, interceptors, and error-handling patterns.
- Do not change global styles, theme tokens, or design-system primitives unless explicitly asked.
- For new components/pages, prefer consistency with existing UI patterns over personal preference.

## Code Quality Rules

- Do not add dead code, commented-out code, or speculative abstractions.
- Do not perform broad refactoring while solving a local task.
- Do not rename public component/service APIs unless explicitly requested.
- Prefer readable code over clever code.
- Use professional, descriptive naming for all variables, parameters, functions, and types.
- Choose names by intent and domain meaning, not by brevity; names must be understandable without extra context.
- Avoid one-letter or vague names (`t`, `x`, `tmp`, `data`, `obj`, `deps`, `cfg`) unless they are standard short loop indices (`i`, `j`) in very local scope.
- Keep imports clean and remove unused code after changes.
- Preserve backward compatibility for public-facing contracts where possible.
- Always preserve correct text encoding (`UTF-8`) when reading/writing files and verify no mojibake/corrupted Cyrillic characters are introduced.
- For user-facing strings, use normal readable UTF-8 text directly; do not use Unicode escape sequences (`\uXXXX`) unless explicitly requested.

## Styling Rules

- Follow the styling approach already used in the repo (`SCSS`, `CSS`, Tailwind, PrimeNG patterns, etc.).
- For PrimeNG UI changes, use only Tailwind classes in templates or PrimeNG `pt` configurations.
- Do not edit component/global CSS files for PrimeNG UI tasks unless explicitly requested.
- Do not replace the styling strategy unless explicitly requested.
- Avoid changing unrelated layout/styling while solving functional tasks.
- Keep styling changes local to the feature whenever possible.

## Testing & Verification

Before завершением задачи, Codex should run what is available and relevant in this repo:

1. Install dependencies if needed:

- `npm ci`
- or the repo’s existing install command

2. Static checks:

- `npx nx lint storefront`, `npx nx lint admin`, or the relevant project target
- Always run relevant lint targets for changed projects after edits and before running build.

3. Unit/component/integration tests:

- Run `npx nx test <project>` only when that target exists.
- Derive the test runner and setup from the repository; do not assume a tool
  from an installed package alone.

4. Build:

- `npx nx build <app>` (`npx nx build storefron` or `npx nx build admin`)

If a command does not exist or fails, explicitly report:

- which command was run
- what failed
- whether the failure is related to the change or is pre-existing

## Change Policy

- Do not update Angular, dependencies, or tooling versions unless explicitly requested.
- Do not modify environment files, deployment config, CI/CD, or secrets unless the task is specifically about them.
- Do not rewrite large template/style sections when a small targeted fix is enough.
- Do not introduce breaking UI/API assumptions without explicit instruction.

## Output Format

For each task, report in this order:

1. What was changed
2. Which files were modified
3. What was verified
4. What could not be verified
5. Risks / what should be checked manually

## Definition of Done

The task is done when:

- The requested frontend behavior is implemented.
- The change is minimal and localized.
- Existing architecture and project patterns are respected.
- Lint/tests/build were run when available, or the reason they were not run is clearly stated.
- No obvious unrelated regressions were introduced.
