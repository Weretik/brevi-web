# 001 — Відновлення шарів і меж React Admin

- **Поверхня:** React Web
- **Статус:** complete
- **Власник:** frontend
- **Оновлено:** 2026-10-01

SDD переводить наявні `libs/admin` із змішаних responsibilities до цільових
Admin layers, approved RTK Query data path і перевірних Nx/public boundaries без
зміни observable поведінки сторінок товарів і довідників.

## Навігація

- [Findings і architecture requirements](requirements/findings.md)
- [Target architecture та migration sequence](design/target-architecture.md)
- [Root-cause аналіз шаблонів і workflow](analysis/template-root-cause.md)
- [Граф задач](tasks/README.md)
- [Traceability](traceability.md)
- [Spec readiness](checklist/spec-readiness.md)
- [Delivery readiness](checklist/delivery-readiness.md)
- [Початковий code audit](code-audit/audit.md)
- [Як запустити реалізацію](USAGE.md)

Remediation виконана за dependencies EN-001/RM-001–RM-010. Фактичні owners,
verification evidence і результати повторного аудиту зафіксовані у
`code-audit/audit.md` та `traceability.md`.
