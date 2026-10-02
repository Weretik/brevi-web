# Медіа/Фото — проєктування frontend

## Наявний контекст

- Перевірені застосунки та бібліотеки: `apps/admin-react/src/app/router/`,
  `libs/admin/core/shell/src/navigation/`, `libs/admin/products/data-access/`,
  `libs/admin/products/feature/`, `libs/admin/references/feature/` та
  `apps/admin-react-e2e/`.
- Наявний шлях стану або даних:
  `libs/admin/products/data-access/src/product-lookups.api.ts` уже володіє
  GET/POST `/api/catalog/media`; product form отримує список через
  `libs/admin/products/feature/src/hooks/product-editor/use-product-lookups.ts` і завантажує
  через `components/product-photo-upload.tsx`.
- Наявні тести та інструменти: Vitest/Node для
  `admin-products-data-access`, Vitest + React Testing Library/jsdom для
  `admin-products-feature`, app router tests у `admin-react`, Playwright у
  `admin-react-e2e`; наявні lint, typecheck і build targets наведені в задачах.
- API snapshot: `docs/contracts/openapi/backend/catalog/product-dependencies.openapi.yaml`;
  generated operation types: `libs/admin/shared/contracts/src/generated/openapi.ts`.

## UX-рішення та зовнішні референси

- Основне представлення — адаптивна сітка карток. Це відповідає задачі
  візуального пошуку: Cloudinary описує card view як сітку для візуального
  сканування з короткими метаданими, а list view — для порівняння метаданих.
  Джерело: <https://cloudinary.com/documentation/media_library_for_developers>.
- На першій версії є пошук за назвою і одиничні upload/delete. Shopify Files та
  Cloudinary підтверджують усталені патерни пошуку, вибору й підтвердженого
  видалення; bulk actions залишаються поза scope через відсутній backend
  контракт. Джерела:
  <https://help.shopify.com/en/manual/shopify-admin/productivity-tools/file-uploads>,
  <https://cloudinary.com/documentation/delete_assets>.
- Картка має стабільне співвідношення області прев'ю, `object-fit: contain`,
  ім'я, локалізований стан і одну destructive action. Помилка завантаження
  зображення показує fallback, а не ламає розкладку.
- Upload відкриває системний file picker, одразу показує обраний filename та
  виконує одну mutation. Drag-and-drop і progress у відсотках не заявляються,
  бо поточні API/transport цього не підтримують.
- Delete відкриває модальний confirm із назвою. Кнопка підтвердження має
  destructive style, блокується на час запиту; 409 не закриває пояснення до
  того, як його прочитає користувач.

## Відповідальності в межах роботи

| Область                        | Відповідальність і точні шляхи                                                                                                                                                                                                           |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Спільна поведінка              | Нормалізація пошуку й runtime media mapping у `libs/admin/products/data-access/src/`; нова shared library не потрібна.                                                                                                                   |
| Стан і отримання даних         | `libs/admin/products/feature/src/hooks/media-library/use-media-library.ts` володіє read/retry/abort і останнім успішним списком; upload/delete mutations мають окремі hooks лише якщо їхній життєвий цикл робить один hook незрозумілим. |
| Інтерфейс React Web            | `libs/admin/products/feature/src/pages/media-library/media-page.tsx` компонує `components/media/` gallery, upload control і delete dialog без HTTP у presentational компонентах.                                                         |
| Навігація та глибокі посилання | `apps/admin-react/src/app/router/legacy-menu.ts`, `app-router.tsx` і `navigation-config.unit.test.ts`; один route `/references/media`.                                                                                                   |
| Браузерні адаптери та дозволи  | Native file input у media upload component; accept є лише UX hint, перевірка дублюється сервером. Нові browser permissions не потрібні.                                                                                                  |
| Інтеграція з API               | `catalog-media.api.ts` володіє GET/POST/DELETE, `catalog-media.mapper.ts` — runtime mapping; обидва використовують наявний HTTP/error boundary і generated operation type.                                                               |
| Перевірка                      | Unit для пошуку/mapping, data-access integration для GET/POST/DELETE/error, component для галереї/upload/confirm/focus, router integration і один критичний Playwright journey.                                                          |

## Початковий аудит відповідальностей

| Файл/компонент/модуль і точний шлях                                                  | Наявні ролі та залежності                                                  | Залишити чи розділити, чому                                                                                                                                     | Цільові файли/каталоги або —                                                             |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `libs/admin/products/data-access/src/product-lookups.api.ts`                         | GET категорій, GET media й POST media через спільний product HTTP helper   | Залишити власником catalog lookup transport; додати DELETE або виділити `catalog-media.api.ts`, якщо upload/delete error mapping зробить файл змішаним          | `src/catalog-media/` лише за фактичною складністю; public API зберегти                   |
| `libs/admin/products/data-access/src/products.mapper.ts`                             | Runtime mapping усіх product responses, включно з media                    | Media mapping уже відокремлена функцією; перенести до окремого mapper лише разом із catalog-media module, не через розмір файла                                 | `src/catalog-media/catalog-media.mapper.ts` за рішенням TS-001 або —                     |
| `libs/admin/products/data-access/src/products.model.ts`                              | Generated aliases для products, categories і media                         | Залишити alias сумісним; UI-модель може відокремитися тільки якщо приховування `storageKey` потребує іншого типу                                                | `src/catalog-media/catalog-media.model.ts` за рішенням TS-001 або —                      |
| `libs/admin/products/feature/src/components/product-editor/product-photo-upload.tsx` | File input, POST, повторний GET і Ready check усередині UI                 | Не перевикористовувати компонент сторінкою: він прив'язує upload до product form. Повторно використати data-access; узгодити helper/validation без копії правил | `src/components/media/media-upload.tsx`, за потреби `src/model/media-file-validation.ts` |
| `libs/admin/products/feature/src/hooks/product-editor/use-product-lookups.ts`        | Завантажує categories, references і media для product form                 | Не додавати стани standalone page; життєвий цикл інший                                                                                                          | `src/hooks/media-library/use-media-library.ts`                                           |
| `libs/admin/references/feature/src/pages/<capability>/*.tsx`                         | Зразки page composition, loading/error, MUI actions і dialogs              | Використати як структурний референс, без імпорту й без копіювання table-specific коду                                                                           | —                                                                                        |
| `apps/admin-react/src/app/router/legacy-menu.ts`                                     | Канонічні групи меню, label і legacy path                                  | Залишити одним map; додати один item, оновити тест очікуваної кількості                                                                                         | —                                                                                        |
| `apps/admin-react/src/app/router/app-router.tsx`                                     | Реєструє available routes і вмикає їх у меню                               | Залишити; додати public `MediaPage` export і route                                                                                                              | —                                                                                        |
| `docs/contracts/openapi/backend/catalog/product-dependencies.openapi.yaml`           | Синхронізований GET/POST/DELETE contract; endpoint ще мають `security: []` | Snapshot не редагувався вручну; він синхронізований з pinned backend commit                                                                                     | backend canonical OpenAPI, потім snapshot/generated output                               |

## Рішення та ризики

- `admin-products` лишається власником catalog media, бо там уже є transport і
  перший споживач. Розміщення пункту в «Загальних довідниках» не створює нової
  доменної копії API.
- Route обрано як `/references/media` за чинною схемою меню. Backend endpoint
  лишається `/api/catalog/media`; UI route не зобов'язаний повторювати API domain.
- Поточний GET не має pagination. Клієнтська галерея відповідає наявному
  контракту; зі зростанням медіатеки server pagination/search потребуватимуть
  окремої зміни контракту.
- Видалення небезпечне без інформації про використання. Мінімальний контракт —
  атомарна backend-перевірка й 409; попередній usage count можна додати окремо,
  але frontend не робить race-prone перевірку замість сервера.
- `security: []` відображає поточну platform policy: React Admin не має
  Bearer/session boundary, а catalog/reference controllers використовують
  `AllowAnonymous`. Локальну auth модель для media не додано; спільний захист
  Admin API є окремою platform feature.
