# Feature specifications

This index contains SDD requirements and tasks. The [implemented feature map](../features/README.md) describes the current implementation separately from plans.

The Storefront currently has README files for its Nx feature libraries, but they are not SDDs: [home](../../libs/storefront/feature/home/README.md), [catalog](../../libs/storefront/feature/catalog/README.md), [contacts](../../libs/storefront/feature/contacts/README.md), [about-us](../../libs/storefront/feature/about-us/README.md), [order-in-bulk](../../libs/storefront/feature/order-in-bulk/order-in-bulk/README.md), and [regions](../../libs/storefront/feature/regions/regions/README.md). See their verified architecture map in [Storefront](../features/README.md#storefront-angular-appsstorefront).

- [Admin: product list](admin/products/README.md)
- [Admin: template migration](admin/migration/README.md)
- [Admin React: shell and corporate theme](admin/shell/001-react-admin-shell-theme/README.md)
- [Admin React: design system «Цех», new top bar and sidebar](admin/shell/002-workshop-design-system/README.md)
- [Admin React: menu migration and header](admin/navigation/001-legacy-menu/README.md)
- [Admin React: six reference tables](admin/references/README.md)
- [Admin React: new product table and actions](admin/products/001-products-table/README.md)
- [Admin React: complete administrative product scenario](admin/products/002-admin-product-scenario/README.md)
- [Admin React: product table and separate pages](admin/products/003-products-table-pages/README.md)
- [Admin React: «Товари» two tables from the Calculator sheet](admin/products/008-products-page/README.md) — implemented 2026-11-03.
- [Admin React: fabric and hardware tables and pages](admin/references/008-garment-materials-pages/README.md)
- [Admin React: operations tables and pages](admin/references/009-operations-pages/README.md)
- [Admin React: suppliers — SDD closed, implementation partial](admin/references/010-suppliers-pages/README.md)
- [Admin React: suppliers — «Цех» page revision](admin/references/001-suppliers/design/workshop-revision.md) — implemented and locally verified with mock API on 2026-11-02; existing dialogs and API preserved.
- [Admin React: suppliers — audit fixes AF-001–AF-003](admin/references/001-suppliers/tasks/TS-007-audit-fixes.md) — implemented and locally verified with focused tests on 2026-11-02.
- [Admin React: additional reference tables and pages](admin/references/011-additional-references-pages/README.md), replaced by [pricing parameters](admin/references/015-pricing-parameters-sheet/README.md)
- [Admin React: fabrics and accessories — Calculator sheet fields and «Цех» pages](admin/references/013-fabrics-accessories-sheet/README.md) — implemented 2026-11-02.
- [Admin React: operations — Calculator sheet fields and a «Цех» page](admin/references/014-operations-sheet/README.md) — implemented 2026-11-02.
- [Admin React: Telegram reminders](admin/reminders/001-telegram-reminders/README.md) — implemented and locally verified 2026-11-01.
- [Admin React: photo library with folders](admin/media/001-photo-library/README.md) — implemented and locally verified 2026-11-03; replaces 007-media.
- [Admin React: «КП» commercial proposals](admin/quotes/001-quotes/README.md) — stages 1–2 (list, «Товари та ціни» editor, «Налаштування КП», PDF) implemented 2026-11-04; stages 3–6 planned.
- [Visual guidance for tables, menus, and forms](admin/table-visual-guidance.md)
- [React Admin migration order](admin/react-migration-roadmap.md)
- [Admin: restore layers and module boundaries](admin/architecture/001-admin-layers-and-boundaries/README.md)
- [Admin React: auth, permissions, and API foundation](admin/auth/001-auth-permissions-api-foundation/README.md) — history; its token session and TS-007 anonymous mode are replaced by 002.
- [Admin React: cookie sign-in like Kedr](admin/auth/002-cookie-sign-in/README.md) — sign-in page, cookie session with CSRF, «Немає доступу», «Користувачі».
- [Public site on Next.js: migration plan from brevi.com.ua](site/migration/README.md) — plan accepted 2026-10-30; each step gets its own SDD.
- [Specification creation and delivery rules](../standards/shared/delivery-rules.md)

- [Admin React: sewing articles and composition](admin/products/004-sewing-articles-and-composition/README.md) — implementation checkpoint 2026-10-25; remaining deployment gates in its implementation file.
- [Admin React: sewing composition structure](admin/products/005-sewing-composition-structure/README.md) — structural remediation verified 2026-10-25.
- [Admin React: Sewing Article pricing](admin/products/006-sewing-pricing/README.md) — implemented and verified 2026-10-25.
- [Admin React: PPE pricing](admin/products/007-ppe-pricing/README.md) — implemented and verified 2026-10-25.
- [Admin React: клієнти, КП та індивідуальне пошиття](admin/clients/001-clients-quotes-custom-sewing/README.md) — history; its КП, PDF, email and custom-sewing screens were removed 2026-11-04, only KeepinCRM clients stay.

When a specification's status changes, update its line here in the same change.

- [FE-EN-003: BreviERP public legal pages](admin/clients/001-clients-quotes-custom-sewing/tasks/readiness/fe-en-003.md) — history; Gmail sending comes back in КП stage 3.

[P6 release candidate](admin/clients/001-clients-quotes-custom-sewing/evidence/p6-release-2026-11-02.md) — history.
