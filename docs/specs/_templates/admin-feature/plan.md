# Implementation plan: <назва Admin feature>

**Spec:** [spec.md](spec.md)  
**Дата:** YYYY-MM-DD

## Summary

<Підхід реалізації, що задовольняє P1 user story.>

## Technical context

- **Stack:** React, TypeScript, RTK Query, MUI, Nx.
- **Testing:** Vitest, RTL, Playwright; <точні test files, Nx targets та e2e рішення з spec.md>.
- **Security:** <review level, route/action access, sensitive data, 401/403 handling, або n/a з причиною>.
- **Performance / constraints:** <pagination, rendering, permissions або n/a>.

## Architecture and source paths

```text
libs/admin/<domain>/
├── model/        # domain types, query, pure invariants
├── data-access/  # private DTO, mapper, RTK Query endpoints/hooks
├── ui/           # presentational components and states
└── feature/      # page composition and local UI state
```

- `model` не залежить від React, HTTP або browser API.
- `data-access` володіє DTO; `ui` не викликає API або router.
- `feature` оркеструє page та працює лише через public exports.

## Constitution check

- [ ] Nx boundaries, public `src/index.ts` і чинні Admin standards дотримано.
- [ ] Test strategy відповідає `docs/standards/testing-rules.md`; потрібні Nx test targets існують.
- [ ] Security/access рішення відповідає `docs/standards/security-rules.md`.
- [ ] Усі нові залежності та відхилення від архітектури обґрунтовано нижче.

## Complexity tracking

| Відхилення   | Чому потрібне | Чому простіший варіант не підходить |
| ------------ | ------------- | ----------------------------------- |
| <за потреби> | <причина>     | <причина>                           |
