# Traceability: site shell

| Scenario | Code                                                                      | Test or evidence                                              | Status   |
| -------- | ------------------------------------------------------------------------- | ------------------------------------------------------------- | -------- |
| SC-001   | `libs/site/core/shell/src/lib/site-shell.tsx`, `header/`, `footer/`       | `site-shell.spec.tsx`                                         | verified |
| SC-002   | `controls/nav-link.tsx`                                                   | `site-shell.spec.tsx`                                         | verified |
| SC-003   | `header/catalog-menu.tsx`, `header/use-dismiss.ts`                        | `site-shell.spec.tsx`                                         | verified |
| SC-004   | `header/mobile-menu.tsx`                                                  | `site-shell.spec.tsx`                                         | verified |
| SC-005   | `controls/locale-switch.tsx`, `libs/site/core/i18n`                       | `site-shell.spec.tsx`, `localized-path.spec.ts`               | verified |
| SC-006   | `apps/site/next.config.mjs`, `src/proxy.ts`, `[locale]/[...rest]/page.tsx` | [SEO verification](verification/seo-verification.md)          | verified |
| SC-007   | `libs/site/core/seo/src/lib/crawling`, `metadata/robots-policy.ts`        | `crawling.spec.ts`, `page-metadata.spec.ts`, SEO verification | verified |
| SC-008   | `libs/site/core/seo`, `apps/site/src/app/[locale]/{layout,page}.tsx`      | `page-metadata.spec.ts`, `json-ld.spec.tsx`, SEO verification | verified |
| SC-009   | `header/header-actions.tsx`, `crawling/robots-file.ts`                    | `site-shell.spec.tsx`, `crawling.spec.ts`                     | verified |
