# Suppliers — Rules and Acceptance Scenarios

## Goals and scope

- **Actor:** Admin employee.
- **Goal:** View and edit suppliers through a compact table and separate pages.
- **In scope:** context actions, Ukrainian locale, direct routes, read-only detail, shared create/edit form, white semantic surfaces.
- **Out of scope:** new supplier fields, URL policy changes, bulk editing, design tokens, dependencies, and other sections.

## Business rules

- **R-001:** The `/references/supplier` table has no “Actions” column. Right-clicking a row opens an MUI Menu with “View”, “Edit”, and “Delete” for that supplier; deletion requires confirmation and does not change selection as a side effect.
- **R-002:** The focused row opens the same menu with the Context Menu key or Shift+F10; the menu closes on action/Escape/click-away and restores focus.
- **R-003:** All Data Grid system labels are Ukrainian through centralized MUI/MUI X localization; no rows and no results messages are also Ukrainian.
- **R-004:** Separate routes: `/references/supplier/create`, `/references/supplier/:id`, `/references/supplier/:id/edit`. Direct URLs and reloads fetch the supplier by ID and show loading/error/not-found/retry states.
- **R-005:** Detail shows only the ID, name, phone, contact person, link, and notes. Data is grouped into white sections; a safe http(s) link can be opened, and the “Edit” button navigates to edit.
- **R-006:** Create/edit share one form structure and validation. Create starts with empty user fields; edit starts with current values. The primary action is “Create supplier” or “Save changes”.
- **R-007:** All fields appear in white MUI Card/Paper surfaces. Basic data, contacts, and additional information form separate logical frames where this improves readability; a wide layout collapses to one column on narrow viewports.
- **R-008:** Use existing MUI components and the Brevi theme; screenshots guide composition only.

## Acceptance scenarios

### SC-001 — Context actions

**Covers:** R-001, R-002

- **Given** a supplier is present in the table
- **When** an employee opens its row menu with a mouse or keyboard
- **Then** the three actions for the correct record appear without an “Actions” column, and closing the menu preserves selection and restores focus.

### SC-002 — Ukrainian Data Grid

**Covers:** R-003

- **Given** menus, filters, pagination, or an empty state are available
- **When** an employee interacts with the table
- **Then** all system text is Ukrainian.

### SC-003 — Read-only detail

**Covers:** R-004, R-005

- **Given** a supplier exists
- **When** detail is opened from the list or by direct URL
- **Then** all fields appear read-only in white sections, a valid link opens safely, and the edit button navigates to the form.

### SC-004 — Shared create/edit form

**Covers:** R-006, R-007

- **Given** a supplier is being created or edited
- **When** the form opens
- **Then** it has the same structure in both modes, is empty for create and populated for edit, and groups fields in responsive white frames.

### SC-005 — Save and errors

**Covers:** R-004, R-006

- **Given** the form is valid or the API returns a validation/not-found/conflict error
- **When** the employee saves
- **Then** success opens the actual detail page, while failure preserves input and allows correction/retry without a duplicate write.

### SC-006 — Deletion

**Covers:** R-001

- **Given** “Delete” is selected from the menu
- **When** the employee confirms or cancels
- **Then** the list refreshes only after a successfully confirmed deletion.

### SC-007 — Responsive surfaces

**Covers:** R-007, R-008

- **Given** detail or a form is open
- **When** the viewport changes from wide to narrow
- **Then** white logical frames become a vertical layout without losing fields.
