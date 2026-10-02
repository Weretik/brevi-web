# Фаза 04 — UI та feature ownership

- Відокремити reusable presentation від orchestration.
- Передавати values/errors/callbacks через typed contracts.
- Залишити routes, user-flow coordination і local UI state у feature.

**Checkpoint:** UI не володіє API/router/server state; behavior regression green.
