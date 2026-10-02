# Додаткові довідники — готовність до постачання

- [ ] EN-001 verified and contracts synchronized.
- [ ] All SC verified/deferred and task evidence recorded.
- [ ] Row menu, locale, routes, themes/viewports verified.
- [ ] No action column or create/view/edit dialog remains.
- [ ] Contracts/lint/typecheck/tests/E2E/build passed.
- [ ] Audit/traceability/report complete.

## Delivery blocker — 2026-10-01

Delivery checkpoint не досягнуто. Актуальний backend OpenAPI не містить
`getAdditionalReferenceById`, `createAdditionalReference` і
`deleteAdditionalReference`; тому EN-001 та залежні TS-001–TS-005 лишаються
blocked без frontend припущень про DTO, ID ownership або HTTP statuses.

Перевірено доступну базову регресію: lint чотирьох affected projects,
data-access/feature/app tests, focused current-flow E2E, typechecks,
`contracts:check` і `admin-react` production build пройшли.
