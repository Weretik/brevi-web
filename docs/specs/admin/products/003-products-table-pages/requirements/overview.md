# Products — rules and acceptance scenarios

## Goal and scope

- **Actor:** Admin staff member.
- **Goal:** manage products through a compact table and clear, separate view,
  create, and edit pages in Ukrainian.
- **In scope:** row context menu, MUI localization, white filter fields,
  composition of existing detail/create/edit pages, and accessible navigation.
- **Out of scope:** changes to domain fields, API, calculations, authorization,
  global design tokens, dependency versions, and the public storefront.

## Business rules

- **R-001:** The table has no “Дії” column. Right-clicking a row opens its
  context menu with “Перегляд”, “Змінити”, and “Видалити”; deletion still
  requires confirmation. The menu closes after selection, Escape, or an outside
  click and does not change checkbox row selection.
- **R-002:** The same three actions are available for a focused row via the
  context-menu key or Shift+F10; focus returns to the row when the menu closes.
- **R-003:** All built-in MUI Data Grid labels visible to users are Ukrainian.
  The official `ukUA` locale is extended through the supported MUI locale API
  for missing keys; local empty/no-results messages do not revert to English.
- **R-004:** Search, type, and category filters above the table have a white
  surface and clear boundary against the page background in every state. Their
  existing server-side semantics do not change.
- **R-005:** List, create, detail, and edit retain `/references/products`,
  `/create`, `/:id`, and `/:id/edit` routes. Opening or reloading detail/edit
  directly loads the product by ID and shows loading, not found, error, and
  retry states independently of list state.
- **R-006:** Detail is read-only. Data is grouped by meaning across several
  white MUI surfaces; “Редагувати” navigates to that product's edit page.
- **R-007:** Create and edit use the same structure, fields, and validation.
  User-entered fields are empty or unselected on create and populated with
  current values on edit. The primary action reads “Створити товар” or
  “Зберегти зміни”, respectively.
- **R-008:** Each major logical form group has its own white MUI Card/Paper,
  spaced from other groups. Compatible groups may sit side by side on wide
  screens and stack in one column on narrow screens; no fields sit directly
  on the page background.
- **R-009:** Use existing MUI/MUI X components and the Brevi theme. Visual
  references define composition; the current contract defines fields and actions.

## Acceptance scenarios

### SC-001 — Row context actions

**Covers:** R-001

- **Given** a product appears in the table
- **When** a staff member opens its row context menu
- **Then** they see three Ukrainian actions for that product without a “Дії”
  column, and view or edit opens the corresponding separate page.

### SC-002 — Keyboard access to the menu

**Covers:** R-002

- **Given** a table row has focus
- **When** a staff member invokes its context actions from the keyboard and closes the menu
- **Then** each action can be selected, and focus returns to the same row.

### SC-003 — Ukrainian table interface

**Covers:** R-003

- **Given** the table has a column menu, filters, pagination, or empty state
- **When** a staff member opens the available table controls
- **Then** all system labels and messages appear in Ukrainian.

### SC-004 — Visible filters

**Covers:** R-004

- **Given** the product list is open in a supported theme
- **When** a staff member searches or selects a type or category
- **Then** each field has a white surface, remains distinct from the background,
  and retains its current query behavior.

### SC-005 — Separate detail page

**Covers:** R-005, R-006

- **Given** a product has several data groups
- **When** a staff member opens its detail page directly or from the list
- **Then** they see read-only logical white sections and an edit button;
  reloading yields the same result.

### SC-006 — Shared create/edit form

**Covers:** R-007, R-008

- **Given** a staff member creates a product or edits an existing one
- **When** the form opens
- **Then** its structure and fields are the same, create is empty, edit is
  populated, and semantic groups occupy responsive white surfaces.

### SC-007 — Saving and errors

**Covers:** R-005, R-007

- **Given** the form has valid data or the server returns an error
- **When** a staff member performs the primary action
- **Then** success opens the current detail page, while an error preserves
  input, explains the problem, and prevents a duplicate request.

### SC-008 — Responsive composition

**Covers:** R-008, R-009

- **Given** a page has several semantic sections
- **When** its width changes from narrow to wide
- **Then** sections reflow without clipping fields horizontally, remain
  separate white surfaces, and use the agreed Brevi components.
