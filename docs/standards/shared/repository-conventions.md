# Repository File Conventions

## Code and change boundaries

- Preserve existing public APIs, behavior, and naming conventions unless the task requires a change.
- Use clear, domain-specific names for new variables, parameters, functions, and types; do not add speculative abstractions or dead code.
- Keep local changes within their scope; do not add unrelated refactoring, dependency updates, or tooling.

## Text encoding

- Preserve UTF-8 when reading and writing files. Check that Ukrainian and other Cyrillic text has not been corrupted.
- Write user-visible text as readable UTF-8; use `\uXXXX` only when a specific format or task requires it.
