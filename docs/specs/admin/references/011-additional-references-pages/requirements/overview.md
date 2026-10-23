# Additional References — Rules and Acceptance Scenarios

## Purpose and Scope

- **Actor:** Admin employee.
- **Goal:** View, create, edit, and delete additional references as consistently as other tables in the section.
- **In scope:** Table context menu, Ukrainian locale, create/detail/edit routes, delete confirmation, current fields, and white semantic surfaces.
- **Out of scope:** New business fields/units, bulk actions, formula changes, global tokens, dependency upgrades, and implementation without an API contract.

## Business Rules

- **R-001:** The `/references/additional-reference` table has no “Actions” column. Right-clicking a row opens “Перегляд”, “Змінити”, and “Видалити” for that record; deletion always requires confirmation.
- **R-002:** The focused row opens the same menu using the Context Menu key or Shift+F10; an action, Escape, or click-away closes it and restores focus.
- **R-003:** All Data Grid system text is in Ukrainian through the centralized MUI/MUI X locale, including menus, pagination, filters, and no-rows/results messages.
- **R-004:** Separate routes: `/references/additional-reference/create`, `/references/additional-reference/:id`, and `/references/additional-reference/:id/edit`. A direct URL/reload fetches the record by ID and distinguishes loading/error/not found/retry states.
- **R-005:** Detail is read-only and displays ID, name, key, value, unit, and description in white semantic sections; the “Редагувати” button navigates to edit.
- **R-006:** Create/edit share one form structure and validation. Create has all user fields empty/unselected; edit shows current values. The primary action is “Створити запис” or “Зберегти зміни”.
- **R-007:** All fields are placed in white MUI Card/Paper components. The main identification fields, value/unit, and description form separate frames by meaning; horizontal layouts stack vertically on narrow viewports.
- **R-008:** Create, GET-by-ID, and delete are performed only after versioned OpenAPI operations exist. Until then, the related scenarios are blocked, and the UI does not simulate local CRUD results.
- **R-009:** Use existing MUI components and the Brevi theme; screenshots define composition, not fields or units.

## Acceptance Scenarios

### SC-001 — Context Menu

**Covers:** R-001, R-002

- **Given** an additional reference is present in the table
- **When** an employee opens the menu with a mouse or keyboard
- **Then** they see three actions for the correct row without an “Actions” column, and closing the menu restores focus.

### SC-002 — Ukrainian Data Grid

**Covers:** R-003

- **Given** a table system control is available
- **When** an employee opens it
- **Then** all labels and messages are in Ukrainian.

### SC-003 — Read-only Detail

**Covers:** R-004, R-005, R-008

- **Given** the record exists and the detail contract is available
- **When** an employee opens it from the list or by direct URL
- **Then** they see all fields read-only in white sections and an edit button.

### SC-004 — Shared Create/Edit Form

**Covers:** R-006–R-008

- **Given** the required CRUD contracts are available
- **When** an employee creates or edits a record
- **Then** the structure is the same, create fields are empty, edit fields are populated, and fields are grouped into responsive white frames.

### SC-005 — Saving and Errors

**Covers:** R-004, R-006, R-008

- **Given** the form is valid, or the API returns a validation/not-found/conflict error
- **When** an employee saves
- **Then** success opens the actual detail page, while failure preserves entered values and allows correction/retry without a duplicate write.

### SC-006 — Deletion

**Covers:** R-001, R-008

- **Given** the delete contract is available and “Видалити” has been selected
- **When** an employee confirms or cancels
- **Then** success refreshes the list, while cancel/failure does not incorrectly remove the row.

### SC-007 — Responsive Surfaces

**Covers:** R-007, R-009

- **Given** detail or a form is open
- **When** the viewport changes
- **Then** all fields/data remain within white semantic frames without overflow.
