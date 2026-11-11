/**
 * A built-in role (Director, Admin, Accountant, Manager, WorkshopChief, Seo) or a role made on
 * «Права доступу» (`custom-…`). Director is the single owner account; the server also gives it Admin.
 */
export type StaffRole = string;

export const directorRole: StaffRole = 'Director';

/** A role the users page may assign, with its title from «Права доступу». */
export interface StaffRoleOption {
  name: StaffRole;
  title: string;
  /** The director: every right, not editable. */
  locked: boolean;
}

export interface StaffAccount {
  id: number;
  email: string;
  fullName: string;
  role: StaffRole;
  isBlocked: boolean;
  /** Photo on the CDN; null shows the first letter of the name. */
  avatarUrl: string | null;
  phoneNumber: string | null;
}

/** What an administrator or the director changes in someone's account from the users page. */
export interface StaffDetailsInput {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface CreateStaffAccountInput {
  email: string;
  fullName: string;
  role: StaffRole;
  password: string;
  phoneNumber: string;
}

/** Built-in roles; used while the server list of roles is not loaded. */
export const staffRoles: readonly StaffRole[] = [
  'Manager',
  'WorkshopChief',
  'Seo',
  'Accountant',
  'Admin',
  'Director',
];

/** Titles of the built-in roles; a fallback when the server title is not known. */
export const staffRoleLabels: Readonly<Partial<Record<StaffRole, string>>> = {
  Director: 'Директор',
  Admin: 'Адміністратор',
  Accountant: 'Бухгалтер',
  Manager: 'Менеджер',
  WorkshopChief: 'Начальник цеху',
  Seo: 'SEO-фахівець',
};

/** The built-in roles as options, for when the server list is unavailable. */
export const builtInStaffRoleOptions: readonly StaffRoleOption[] = staffRoles.map((name) => ({
  name,
  title: staffRoleLabels[name] ?? name,
  locked: name === directorRole,
}));

/** Server title, then the built-in label, then the role name itself. */
export const getStaffRoleTitle = (
  role: StaffRole,
  options: readonly StaffRoleOption[] = [],
): string => options.find((option) => option.name === role)?.title || staffRoleLabels[role] || role;
