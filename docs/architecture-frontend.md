# Frontend Architecture (Angular)

## 1. Application Contexts

The application is split into two isolated contexts:

```
src/app/
  admin/
  storefront/
  shared/
```

### Rules

- `admin` must not import from `storefront`
- `storefront` must not import from `admin`
- shared cross-context code must live only in `src/app/shared`

Enforced by ESLint (`no-restricted-imports`).

---

## 2. Context Structure

Each context (`admin`, `storefront`) follows the same internal structure:

```
<context>/
  core/
  shared/
  features/
```

### 2.1. core

Contains:

- bootstrap and providers
- layout / shell
- guards / interceptors
- application-level configuration

Rule: `core` must not depend on `features`.

### 2.2. shared

Contains:

- reusable UI components (without foreign business logic)
- utils / helpers
- types / contracts

Rule: `shared` must not depend on `features`.

### 2.3. features

Contains business functionality. Each feature is an autonomous module.

---

## 3. Feature-based Architecture

Each feature lives in its own folder:

```
features/<feature>/
  index.ts          (public API)
  pages/
  services/
  types/
  <feature>.routes.ts
```

### Rules

- `features` may import from `core` and `shared`
- feature → feature imports are allowed only via public API (`index.ts`)
- deep-imports into feature internals are forbidden

---

## 4. Feature Public API (`index.ts`)

`index.ts` is the only allowed entry point for importing a feature from outside.

### Example

```ts
export * from './types/reference.types';
```

### Allowed

```ts
import { ReferenceType } from '@admin/features/reference';
```

### Forbidden (deep import)

```ts
import { ReferenceService } from '@admin/features/reference/services/reference.service';
```

Enforced by ESLint.

---

## 5. Aliases and Imports

The following path aliases are used:

- `@admin/*`
- `@storefront/*`
- `@shared/*`

### Forbidden

- relative imports between contexts
- bypassing aliases using paths like `../../../admin/...` or `../../../storefront/...`

Correct usage:

```ts
import { X } from '@admin/features/reference';
```

---

## 6. Architecture Mode

The project uses **S1 mode**:

- feature → feature imports are allowed
- only through `index.ts`
- no access to internal files of a feature

Nx is not used at this stage.

---

## 7. Tooling and Enforcement

### Tools

- ESLint (flat config)
- Prettier
- Husky
- lint-staged

### Automatic checks (on `git commit`)

- Prettier formats staged files
- ESLint validates and fixes staged files
- commit is blocked on errors

### Manual commands

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

---

## 8. Rationale

- scalable structure
- strict import boundaries
- clear ownership of code
- safe refactoring
- easy future migration to Nx

---

## 9. Architecture Review Triggers

The architecture should be revisited when:

- a second frontend application is added
- the team grows significantly
- shared domain/state across apps is required
- there is a real need to migrate to Nx

---

## Status

This document is mandatory. Any architectural change must be reflected here and in the ESLint configuration.
