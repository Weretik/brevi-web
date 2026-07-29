# <назва Admin feature> — API-контракт

| Операція | Endpoint         | Request      | Response       | Errors / access       |
| -------- | ---------------- | ------------ | -------------- | --------------------- |
| <назва>  | `<METHOD /path>` | <query/body> | <domain model> | <стани та permission> |

Посилайтеся на погоджений versioned OpenAPI або backend contract. DTO, mapper і
transport errors лишаються private у `data-access`; `feature` та `ui` працюють
з domain-моделями.
