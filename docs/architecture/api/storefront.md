# Поточна API-межа Storefront

**Перевірено:** 2026-10-15 за `apps/storefront` і `libs/{storefront,shared}`.
Ця сторінка описує Angular Storefront. [API-архітектура Admin](README.md)
містить окремий **цільовий** React transport і не є поточним станом Storefront.

## Що реалізовано

`apps/storefront/src/app/app.config.ts` реєструє Angular `HttpClient` із
`withFetch()` та interceptor pipeline в такому порядку:

1. `baseUrlInterceptor` додає `environment.api.baseUrl` до відносних URL;
   абсолютні `http(s)` URL не змінює.
2. `loggingInterceptor` передає метадані запиту в `AppLogger` за прапорцем
   `enableHttpLogs`; перевір його поведінку перед увімкненням логування у
   середовищі з чутливими даними.
3. `errorInterceptor` перетворює HTTP failure на `AppApiError` з кодом, статусом,
   повідомленням, validation fields і, якщо є, `traceId`. Він розпізнає
   Problem Details та масиви Ardalis validation errors.

`provideApiAndLogging(environment)` надає `API_BASE_URL`, прапорець HTTP-логів
і конфігурацію `AppLogger`. У development `api.baseUrl` дорівнює
`http://localhost:5000/storefront`, у production manifest —
`https://api.brevi.com.ua/storefront`. Це **значення в коді**, а не
підтвердження доступності backend або актуального deployment.

## Фактичні споживачі й стан

Пошук `HttpClient`, `http.get/post/put/delete`, `fetch` та `axios` у
`apps/storefront` і `libs/storefront` не виявив поточного feature-запиту до
backend. `libs/storefront/data-access` поки містить компонент-заготовку, а не
реалізований API adapter. Каталог і сторінки використовують локальні дані та
стан компонентів. Тому зараз немає карти конкретних Storefront operations,
runtime-мапінгу DTO чи політики кешу, яку можна чесно описати як чинну.

Серверний `apps/storefront/src/server.ts` не реалізує backend proxy: приклад
`/api/**` закоментований. Transloco loader повертає локальні TypeScript
переклади через `of(...)`, тому назва `TranslocoHttpLoader` сама по собі не
означає HTTP-запит.

## Коли з'явиться перший API consumer

До реалізації знайди операцію в backend OpenAPI й зафіксуй `operationId`,
джерело snapshot та backend revision за
[життєвим циклом контракту](contract-workflow.md). Розмісти transport і
мапінг у відповідному Storefront `data-access` boundary, а feature залиш
відповідальною за видимі loading/empty/error стани. Перевір наявні
interceptors, runtime validation, SSR поведінку, auth/CSRF, cache та
скасування саме для конкретної операції; не перенось механічно React Admin
RTK Query/Axios правила.

Після впровадження онови цю сторінку таблицею `operationId → consumer →
mapper/model → cache/error behavior → тест`, зазначивши фактичні файли й
перевірки. OpenAPI-схеми в Markdown не копіюй.
