# API contract: «Контент → Товари»

Source of truth: BreviERP `docs/sdd/contracts/content/content-products.openapi.yaml` at commit `f6c8fd16c237bbacc0fa5978d77b25f616eaf7d6`, synced into [the snapshot](../../../../../contracts/openapi/backend/content/content-products.openapi.yaml). Policy `access:content-products`.

| operationId                   | Use                              | Client decisions                                                                                                                                                        |
| ----------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getContentProducts`          | List and the three filter counts | `site` filter maps to `onSite` (`all` sends nothing); counts are the same query with `pageSize=1`; tag `ContentProduct/LIST`                                            |
| `getContentProduct`           | Side panel                       | Loaded when the panel opens; tag `ContentProduct/<productId>`                                                                                                           |
| `saveContentProduct`          | «Зберегти» in the panel          | Sends the opened `revision`; texts are built from the plain-text fields; invalidates the list and the product, also after an error, because 409 means newer data exists |
| `setContentProductVisibility` | «На сайті» switch in the list    | Invalidates the list and the product; `showOnSite && !onSite` shows the inactive-product warning                                                                        |
| `deleteContentProduct`        | «Видалити сторінку»              | Invalidates the list and the product                                                                                                                                    |
| `importOldSiteProductPages`   | «Перенести зі старого сайту»     | The file's pages are sent as they are; first with `dryRun: true`, then with `false` on «Перенести»; a real transfer invalidates every `ContentProduct` tag              |

Responses are validated at runtime in `content-product.mapper.ts` and `old-site-import.mapper.ts`; a response of another shape is an error, not partial data. Errors go through `contentApiError`, which keeps the server's Ukrainian reason for 409 and 404. No retries; RTK Query cancels a replaced list request.
