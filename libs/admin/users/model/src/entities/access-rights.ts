/** What a role may do on one admin page; every action other than `view` needs `view`. */
export type AccessAction = 'view' | 'create' | 'edit' | 'delete';

/** Actions in the order the page shows them. */
export const accessActions: readonly AccessAction[] = ['view', 'create', 'edit', 'delete'];

/** Actions a page may grant besides seeing it; shown as checkboxes after the «Бачить» switch. */
export const accessChangeActions: readonly Exclude<AccessAction, 'view'>[] = [
  'create',
  'edit',
  'delete',
];

export const accessActionLabels: Readonly<Record<AccessAction, string>> = {
  view: 'Бачить',
  create: 'Створювати',
  edit: 'Редагувати',
  delete: 'Видаляти',
};

/** Page key → allowed actions. A page without a key is hidden from the role. */
export type AccessGrants = Readonly<Record<string, readonly AccessAction[]>>;

/** One admin page that access can be given to, in menu order. */
export interface AccessArea {
  key: string;
  /** Menu group title in Ukrainian; pages of one group share a card. */
  group: string;
  title: string;
  /** Actions the page actually has; always includes `view`. */
  actions: readonly AccessAction[];
}

export interface AccessRole {
  name: string;
  title: string;
  /** The director: every right, not editable. */
  locked: boolean;
  /** Built-in roles are never deleted. */
  builtIn: boolean;
  userCount: number;
  /** Optimistic concurrency version sent back on save. */
  version: number;
  updatedByName: string | null;
  updatedAt: string | null;
  grants: AccessGrants;
}

export interface AccessRights {
  areas: readonly AccessArea[];
  roles: readonly AccessRole[];
}

/** Pages of one menu group, in menu order. */
export interface AccessAreaGroup {
  title: string;
  areas: readonly AccessArea[];
}

export const roleTitleMaxLength = 100;
