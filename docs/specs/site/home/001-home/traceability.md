# Traceability: home page

| Scenario | Code                                                                      | Test or evidence                                                         | Status   |
| -------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------ | -------- |
| SC-001   | `libs/site/home/ui/src/lib/sections/home-hero.tsx`                        | `home-ui.spec.tsx`                                                       | verified |
| SC-002   | `libs/site/home/feature/src/lib/home-page.tsx`, `home-contacts.tsx`       | `home-page.spec.tsx`                                                     | verified |
| SC-003   | `sections/home-catalog.tsx`, `layout/home-section.tsx`                    | `home-ui.spec.tsx`, `home-page.spec.tsx`                                 | verified |
| SC-004   | `i18n/home-dictionary.ts`, `home-page.tsx`                                | `home-ui.spec.tsx` (dictionary shape), `home-page.spec.tsx`              | verified |
| SC-005   | `sections/home-contacts.tsx`                                              | `home-ui.spec.tsx`                                                       | verified |
| SC-006   | `sections/home-seo-text.tsx`, `libs/site/home/seo/src/lib/faq-json-ld.ts` | `home-ui.spec.tsx`, `home-page.spec.tsx`, `home-seo.spec.ts`             | verified |
| SC-007   | `libs/site/home/seo/src/lib/home-metadata.ts`, `home-page.tsx`            | `home-seo.spec.ts`, [SEO verification](verification/seo-verification.md) | verified |
