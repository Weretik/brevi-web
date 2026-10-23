# Admin Architecture

- **Scope:** target architecture for the React Web application `apps/admin-react`
- **Status:** partially implemented; the actual state is described in the [frontend inventory](../frontend-inventory.md)
- **Approach:** domain-first

## Purpose

These documents define the target architectural contract for React Admin:
domain boundaries, allowed dependencies, state and API organization, Nx rules,
and the SDD process. A new capability is first described in a specification,
then implemented within these boundaries. The shared React Admin shell and
theme are implemented according to the [shell SDD](../../specs/admin/shell/001-react-admin-shell-theme/README.md).
The [map of existing modules](structure/modules.md) distinguishes implemented
Nx projects and routes from target structures in the other documents. Check
the actual state in code before making changes.

## Document map

- [Existing modules and routes](structure/modules.md)
- [Existing Admin features](../../features/README.md#admin-react-appsadmin-react)
- [Application and routing](runtime/application.md)
- [Domains and internal feature structure](structure/domains.md)
- [Dependency rules](structure/dependencies.md)
- [Nx contract and public API](structure/nx-contract.md)
- [State, API, and forms](runtime/state-and-api.md)
- [API contracts and integration conventions](../api/README.md)
- [SDD process and open decisions](sdd-process.md)

Related standards:

- [Admin code organization](../../standards/admin/admin-code-organization.md)
- [Admin UI](../../standards/admin/admin-ui.md)
- [Testing strategy](../../standards/shared/testing-rules.md)
- [Security rules](../../standards/admin/security-rules.md)
- [Admin ADRs](adr/)
