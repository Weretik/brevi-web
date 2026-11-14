# Feature specifications

This index contains SDD requirements and tasks. The [implemented feature map](../features/README.md) describes the current implementation separately from plans.

The Storefront currently has README files for its Nx feature libraries, but they are not SDDs: [home](../../libs/storefront/feature/home/README.md), [catalog](../../libs/storefront/feature/catalog/README.md), [contacts](../../libs/storefront/feature/contacts/README.md), [about-us](../../libs/storefront/feature/about-us/README.md), [order-in-bulk](../../libs/storefront/feature/order-in-bulk/order-in-bulk/README.md), and [regions](../../libs/storefront/feature/regions/regions/README.md). See their verified architecture map in [Storefront](../features/README.md#storefront-angular-appsstorefront).

- [Site Next.js: migration plan](site/migration/README.md) — step 1 done.
- [Site Next.js: home page (migration step 2)](site/home/001-home/README.md) — implemented and locally verified 2026-11-10.
- [Site Next.js: «Виробництво» page](site/production/001-production/README.md) — implemented and locally verified 2026-11-10.
- [Site Next.js: «Доставка та оплата» page](site/delivery/001-delivery/README.md) — implemented and locally verified 2026-11-10.
- [Site Next.js: «Контакти» page](site/contacts/001-contacts/README.md) — implemented and locally verified 2026-11-10.
- [Site Next.js: «Повернення та обмін» page](site/returns/001-returns/README.md) — implemented and locally verified 2026-11-10.
- [Site Next.js: «Наші роботи» page](site/works/001-works/README.md) — implemented and locally verified 2026-11-10.
- [Site Next.js: «Сертифікати» page](site/certificates/001-certificates/README.md) — implemented and locally verified 2026-11-10.
- [Site Next.js: «Пошиття з логотипом» page](site/logo-printing/001-logo-printing/README.md) — implemented and locally verified 2026-11-10.
- [Site Next.js: «Ціни для опту» page](site/wholesale/001-wholesale/README.md) — implemented and locally verified 2026-11-10.
- [Site Next.js: «Галузі» page (industries hub)](site/industries/001-industries-hub/README.md) — implemented and locally verified 2026-11-10.
- [Site Next.js: «Регіони» page (delivery across Ukraine)](site/regions/001-regions/README.md) — implemented and locally verified 2026-11-10.
- [Site Next.js: «Заявка» page (request form)](site/request/001-request/README.md) — page and form implemented 2026-11-10; delivery of requests postponed.
- [Site Next.js: catalog, stage 1 (catalog root and category pages)](site/catalog/001-catalog/README.md) — implemented 2026-11-10 on a snapshot of the old site; product page is next.
- [Site Next.js: catalog, stage 2 (product page)](site/catalog/002-product-page/README.md) — implemented 2026-11-11 on the snapshot of the old site, without prices.
- [Site Next.js: catalog, stage 3 (products from the Admin)](site/catalog/003-catalog-from-admin/README.md) — implemented 2026-11-11: the catalog reads the BreviERP public API, shows prices, and refreshes without a rebuild.
- [Site Next.js: catalog, stage 4 (site categories from the Admin)](site/catalog/004-site-categories/README.md) — implemented 2026-11-11: the tree, category SEO and text come from «Контент → Розділи сайту».
- [Site Next.js: «Договір» page (public offer)](site/agreement/001-agreement/README.md) — implemented and locally verified 2026-11-10.
- [Site Next.js: header, menu, and footer redesign](site/shell/002-header-footer-redesign/README.md) — implemented 2026-11-10.
- [Site Next.js: «Статті» pages](site/articles/001-articles/README.md) — implemented and locally verified 2026-11-10.
- [Site Next.js: shell — layout, header, footer (migration step 1)](site/shell/001-site-shell/README.md) — implemented and locally verified 2026-11-10.
- [Admin: product list](admin/products/README.md)
- [Admin: template migration](admin/migration/README.md)
- [Admin React: shell and corporate theme](admin/shell/001-react-admin-shell-theme/README.md)
- [Admin React: design system «Цех», new top bar and sidebar](admin/shell/002-workshop-design-system/README.md)
- [Admin React: menu migration and header](admin/navigation/001-legacy-menu/README.md)
- [Admin: «Робочий стіл» by role (DESK-001)](admin/dashboard/001-role-desks/README.md) — stage 1 implemented 2026-11-11.
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
- [Admin React: «Кольори» tab and colours picked from the list in the workshop](admin/references/019-fabric-colors/README.md) — implemented 2026-11-11.
- [Admin React: Telegram reminders](admin/reminders/001-telegram-reminders/README.md) — implemented and locally verified 2026-11-01.
- [Admin React: «Швейний цех» stage 1](admin/production/001-workshop-references/README.md) — implemented 2026-11-04.
- [Admin React: «Швейний цех» stage 2, «Виробничі завдання»](admin/production/002-production-orders/README.md) — implemented 2026-11-04.
- [Admin React: «Швейний цех» stage 3, stages, shipments, files, Telegram](admin/production/003-order-tracking/README.md) — implemented 2026-11-04.
- [Admin React: «Швейний цех» stage 4, «Склад тканин»](admin/production/004-fabric-stock/README.md) — implemented 2026-11-04.
- [Admin React: «Швейний цех» stage 5, «Журнал робіт» and «Прогноз пошиття»](admin/production/005-work-log/README.md) — implemented 2026-11-05.
- [Admin React: «Швейний цех» stage 6, «Робочий час» and «Зарплата»](admin/production/006-timesheet-payroll/README.md) — implemented 2026-11-05.
- [Admin React: «Швейний цех» stage 7, «Звіти цеху» and the overview](admin/production/007-workshop-reports/README.md) — implemented 2026-11-05.
- [Admin React: «Швейний цех» stage 8, «Архів цеху»](admin/production/008-workshop-archive/README.md) — implemented 2026-11-05.
- [Admin React: «Склад тканин» stage 2, ledger rules, «Рух тканини», «Залишки» and «Початкові залишки»](admin/warehouse/001-ledger-pages/README.md) — implemented 2026-11-11.
- [Admin React: «Склад тканин» stage 3, edit, void and restore of movements](admin/warehouse/002-movement-revisions/README.md) — implemented 2026-11-11.
- [Admin React: «Склад тканин» stage 4, issuing fabric by actual cutting](admin/warehouse/003-issue-by-cutting/README.md) — implemented 2026-11-11.
- [Admin React: «Склад тканин» stage 5, the four reports](admin/warehouse/004-reports/README.md) — implemented 2026-11-11.
- [Admin React: «Склад тканин» UX stage 2, the «Рух тканини» journal](admin/warehouse/005-movement-journal/README.md) — implemented 2026-11-12.
- [Admin React: «Склад тканин» UX stage 3, «Залишки» with booking](admin/warehouse/006-stock-booking/README.md) — implemented 2026-11-12.
- [Admin React: «Склад тканин» UX stage 4, «Що замовити»](admin/warehouse/007-to-order/README.md) — implemented 2026-11-12.
- [Admin React: «Склад тканин» UX stage 5, «Звіти»](admin/warehouse/008-reports/README.md) — implemented 2026-11-12.
- [Admin React: «Контент → Товари», site pages of products](admin/content/001-product-pages/README.md) — implemented and locally verified 2026-11-11.
- [Admin React: «Контент → Розділи», categories of the site catalog](admin/content/002-site-categories/README.md) — implemented and locally verified 2026-11-11.
- [Admin React: «Контент → Статті», articles of the site](admin/content/003-articles/README.md) — implemented and locally verified 2026-11-11.
- [Admin React: photo library with folders](admin/media/001-photo-library/README.md) — implemented and locally verified 2026-11-03; replaces 007-media.
- [Admin React: «КП» commercial proposals](admin/quotes/001-quotes/README.md) — stages 1–3 (list, «Товари та ціни» editor, «Налаштування КП», PDF, Gmail sending) implemented 2026-11-04; stages 4–6 planned.
- [Admin React: manager tasks and the «Мої завдання» board](admin/tasks/001-manager-tasks/README.md) — implemented 2026-11-04.
- [Admin React: «Ціна вишивки»](admin/embroidery/001-embroidery-price/README.md) — stage 1 implemented 2026-11-04.
- [Visual guidance for tables, menus, and forms](admin/table-visual-guidance.md)
- [React Admin migration order](admin/react-migration-roadmap.md)
- [Admin: restore layers and module boundaries](admin/architecture/001-admin-layers-and-boundaries/README.md)
- [Frontend rules audit and remediation (2026-11-14)](architecture/001-frontend-rules-remediation/README.md) — admin and site, 7 stages; stage 1 done.
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
