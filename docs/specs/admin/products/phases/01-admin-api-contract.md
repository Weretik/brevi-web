# Фаза 1: контракт Admin API списку товарів

**Статус:** accepted  
**Залежить від:** немає  
**Блокує:** фази 2–5

## Мета

Надати стабільний endpoint `GET /api/admin/products`, який повертає сторінку
товарів для Admin і приймає параметри списку через query string.

## Межі

- У межах: backend route, query DTO/handler, мапінг параметрів, `PagedResult`
  відповіді та документований контракт.
- Поза межами: React-код, MUI, storefront endpoint, авторизація, SKU і назва
  категорії.
- Власник: backend-репозиторій; цей frontend-репозиторій не реалізує endpoint.

## Контракт

```http
GET /api/admin/products?SearchTerm={string}&InStock={boolean}&IsSale={boolean}&IsNew={boolean}&PriceFrom={number}&PriceTo={number}&Sort={number}&Page={number}&PageSize={number}
```

- Усі параметри optional, крім того що сервер застосовує значення за
  замовчуванням: `InStock=true`, `Sort=0`, `Page=1`, `PageSize=20`.
- `Sort`: `0=id asc`, `1=id desc`, `2=name asc`, `3=name desc`,
  `4=price asc`, `5=price desc`.
- Невалідні `Page`, `PageSize`, числа цін або `PriceFrom > PriceTo` мають
  повертати `400` у прийнятому backend форматі помилки.
- У поточній фазі endpoint не вимагає авторизації.
- Відповідь: `PagedResult<ProductListRowDto>` з `value`, `pagedInfo` та
  `totalRecords`. Рядок містить `id`, `name`, `productSlug`, `photo`,
  `inStock`, `isSale`, `isNew`, `price`; категорія й SKU не повертаються.

## Сценарії

1. Given валідний query, when клієнт викликає endpoint, then отримує лише
   потрібну серверну сторінку та коректний `totalRecords`.
2. Given `SearchTerm`, when він переданий у query string, then сервер фільтрує
   результат без зміни storefront endpoint.
3. Given невалідний діапазон ціни, when `PriceFrom > PriceTo`, then сервер
   повертає `400`, а не частково неоднозначний результат.

## Критерії приймання

- [ ] `GET /api/admin/products` доступний без сегмента мови.
- [ ] Усі перелічені query-параметри мапляться до поточної логіки вибірки.
- [ ] Відповідь сумісна з контрактом, який використає фаза 2.
- [ ] Storefront route та його поведінка не змінилися.

## Перевірка

- Backend unit/integration перевірки виконуються у backend-репозиторії.
- Ручно перевірити default query, пошук, кожен фільтр, sort, page та невалідний
  діапазон ціни.

## Відкриті питання

- Чи має API повертати локалізовану або базову назву товару до появи Admin i18n?

## Результат перевірки реалізації

Перевірено 2026-07-24 у backend-репозиторії:
`Catalog.Api/Controllers/AdminProductsController.cs` та пов’язані
`GetAdminList` contracts/handler.

### Відповідає фазі

- Є `GET /api/admin/products` з `[FromQuery] GetAdminProductsRequest`.
- Параметри `SearchTerm`, `InStock`, `IsSale`, `IsNew`, `PriceFrom`, `PriceTo`,
  `Sort`, `Page`, `PageSize` реалізовані; значення за замовчуванням збігаються
  з SDD.
- Пагінація, серверне сортування та фільтрація виконуються до вибірки сторінки.
- Endpoint позначено `[AllowAnonymous]`, що відповідає поточному scope.

### Результат повторної перевірки

- `AdminProductListRowDto` тепер містить `Photo`, `Price`, `InStock`, `IsSale`,
  `IsNew` і вони заповнюються в запиті. Цього достатньо для погоджених колонок
  фази 4; `ProductSlug`, `CategoryId`, `Scheme`, `Stock`, `QuantityInPack` є
  додатковими полями та не зобов’язують UI їх показувати.
- `dotnet build src/Catalog/Catalog.Api/Catalog.Api.csproj --no-restore`
  завершився успішно: 0 warnings, 0 errors.

### Усунутий runtime-ризик

`Scheme` прибрано з Admin DTO та EF-проєкції, бо воно не потрібне для цієї
таблиці. Пошук за handler і DTO не знайшов більше посилань на це поле; ризик
неправильно закодованого string property name усунуто.

### Підтверджена validation поведінка

`GetAdminProductListQueryValidator` перевіряє `Sort`, `Page`, `PageSize`,
`CategoryId`, невід’ємність цін і правило `PriceFrom <= PriceTo`. Таким чином,
передача `PriceFrom=1000&PriceTo=100` не доходить до handler та повертає
валідаційну помилку у чинному pipeline. Це відповідає контракту фази.

`GET /api/admin/products/all` є додатковим endpoint і не використовується цією
feature, тому не входить до приймання фази.

## Історія змін

- 2026-07-24: зафіксовано результат перевірки реалізації; статус змінено на
  `needs revision` до погодження складу рядка та поведінки невалідного query.
- 2026-07-24: підтверджено повний склад рядка та успішну backend-збірку;
  виявлено runtime-ризик у назві EF property `Scheme`.
- 2026-07-24: підтверджено `GetAdminProductListQueryValidator`; блокер про
  невалідний ціновий діапазон знято.
- 2026-07-24: `Scheme` прибрано з DTO та проєкції; backend-збірка успішна без
  warnings/errors, фазу прийнято для переходу до фази 2. Реальний HTTP-виклик
  перевіряється у фінальній ручній прийомці фази 5.
