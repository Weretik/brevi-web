# Медіа/Фото — споживання API-контракту

## Джерело та версія

- Backend repository: `https://github.com/Weretik/BreviERP.git`.
- Канонічний OpenAPI entry point: `docs/sdd/contracts/openapi.yaml`.
- Зафіксована версія backend: `e4c1588659684f3d5174fc6dfbfd5bfbd420a6ea`
  у локальній гілці `codex/media-contract`.
- Snapshot/provenance: `docs/contracts/openapi/backend/` і
  `docs/contracts/openapi/SOURCE.json`.
- Generated types: `libs/admin/shared/contracts/src/generated/openapi.ts` через
  `openapi-typescript` і `tools/contracts/contracts.mjs`.
- Статус: синхронізовано і перевірено; authorization лишається platform gap.

| `operationId`        | Метод і шлях                     | Сценарії `SC-*`        | Статус   |
| -------------------- | -------------------------------- | ---------------------- | -------- |
| `getCatalogMedia`    | `GET /api/catalog/media`         | SC-001–SC-003, SC-008  | verified |
| `uploadCatalogMedia` | `POST /api/catalog/media`        | SC-004, SC-005, SC-008 | verified |
| `deleteCatalogMedia` | `DELETE /api/catalog/media/{id}` | SC-006–SC-008          | verified |

## Реалізовані рішення frontend

- GET читає непагінований масив; пошук за filename виконується локально.
- POST надсилає один `File` у полі `file` без ручного `Content-Type`.
- Дозволено JPEG, PNG і WebP до 50 MiB; сервер лишається джерелом істини.
- Runtime mapping пропускає до UI лише `id`, `originalFileName`, `publicUrl`,
  `contentType` і `PendingUpload | Ready`; `storageKey` не виходить із transport.
- DELETE приймає додатний id; 204 оновлює список, 409 зберігає картку й показує
  пояснення. Mutations не повторюються автоматично.
- Read запит скасовується при unmount; failed refresh зберігає останній список.
- 401/403 проходять через спільний `ProductApiError` і не трактуються як успіх.
  Backend endpoints зараз мають `security: []`/`AllowAnonymous`; їх захист
  потребує окремої спільної auth feature для React Admin.

## Перевірки

- [x] Backend OpenAPI містить три стабільні operationId, delete 204/400/404/409,
      multipart `file`, MIME/max size і status enum.
- [x] Виконано `contracts:sync`, `contracts:generate` і `contracts:check` із
      pinned backend commit.
- [x] Mapping/error integration tests доводять GET/POST/DELETE і 409.
- [ ] Захист endpoint та end-to-end 401/403 deferred до спільної Admin auth.
