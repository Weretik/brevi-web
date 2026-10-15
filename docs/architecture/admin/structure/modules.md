# Наявні модулі Admin

Це карта Nx projects, які зараз є в репозиторії, а не перелік запланованих бібліотек. Джерело — `project.json` у зазначених каталогах; перед зміною перевір актуальний код і [frontend inventory](../../frontend-inventory.md). Цільові межі та можливі майбутні домени описані в [domains.md](domains.md).

| Область      | Наявні Nx projects                                     | Відповідальність                              |
| ------------ | ------------------------------------------------------ | --------------------------------------------- |
| Застосунок   | `apps/admin-react`, `apps/admin-react-e2e`             | Композиція React Admin і браузерні перевірки  |
| Core         | `libs/admin/core/{auth,shell}`                         | Сесія та каркас застосунку                    |
| Products     | `libs/admin/products/{model,data-access,ui,feature}`   | Модель товарів, API, презентація та сценарії  |
| References   | `libs/admin/references/{model,data-access,ui,feature}` | Довідники Admin                               |
| Admin shared | `libs/admin/shared/{api-client,config,contracts}`      | API transport, конфігурація й контракти Admin |

Поточний router у `apps/admin-react/src/app/router/app-router.tsx` підключає products і references. `orders`, `clients`, `dashboard` і `core/permissions` у [цільовій схемі](domains.md) не означають, що відповідні Nx projects вже існують. Спільні бібліотеки `libs/shared/*` перевіряй за кодом і [frontend inventory](../../frontend-inventory.md).
