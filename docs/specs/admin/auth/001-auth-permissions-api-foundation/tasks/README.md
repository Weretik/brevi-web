# Граф задач

| ID     | Відповідальність                    | Залежить від   | Статус                  | Файл                                     |
| ------ | ----------------------------------- | -------------- | ----------------------- | ---------------------------------------- |
| EN-001 | Versioned auth OpenAPI              | немає          | done                    | [EN-001](EN-001-auth-openapi.md)         |
| EN-002 | Permissions inputs і first consumer | EN-001         | deferred / out of scope | [EN-002](EN-002-permissions-contract.md) |
| TS-001 | Brevi runtime config                | немає          | done                    | [TS-001](TS-001-runtime-config.md)       |
| TS-002 | Axios RTK transport foundation      | TS-001         | done                    | [TS-002](TS-002-api-client.md)           |
| TS-003 | Auth session lifecycle              | EN-001, TS-002 | done                    | [TS-003](TS-003-auth-session.md)         |
| TS-004 | Shell/app session composition       | TS-003         | done                    | [TS-004](TS-004-session-composition.md)  |
| TS-005 | Permission policy boundary          | EN-002, TS-003 | deferred / not required | [TS-005](TS-005-permissions.md)          |
| TS-006 | Regression і delivery gate          | TS-001–TS-004  | done                    | [TS-006](TS-006-verification.md)         |

TS-001–TS-004 і TS-006 завершено. TS-005 свідомо не входить у delivery без
granular permission contract і consumer. Backend commit
`79cccf9b88168b726ac588640f6b397c0ed9afd4` відновив `deleteCatalogMedia`;
snapshot, generated types і provenance узгоджені.
