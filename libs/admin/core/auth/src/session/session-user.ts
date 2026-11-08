/** Server role names: the built-in ones, `User` for shoppers, or `custom-…` made on «Права доступу». */
export type SessionRole = string;

/** What a role may do on a page of «Права доступу». */
export type AccessAction = 'view' | 'create' | 'edit' | 'delete';

export interface SessionRoleTitle {
  name: string;
  title: string;
  builtIn: boolean;
}

/** The user's own rights from `GET /api/auth/session/access`; the server checks the same ones. */
export interface SessionAccess {
  /** The director: every page and action, also pages added later. */
  allowAll: boolean;
  roles: readonly SessionRoleTitle[];
  /** Page key → allowed actions; a page left out is hidden. */
  grants: Readonly<Record<string, readonly AccessAction[]>>;
}

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  roles: readonly SessionRole[];
  /** Photo on the CDN; null shows the first letter of the name on a color. */
  avatarUrl: string | null;
  access: SessionAccess;
}

export const noAccess: SessionAccess = { allowAll: false, roles: [], grants: {} };

/** Built-in staff roles, strongest first; the director also holds Admin. */
const builtInStaffRoles: readonly string[] = [
  'Director',
  'Admin',
  'Accountant',
  'Manager',
  'WorkshopChief',
];

const outsiderRoles: readonly string[] = ['User', 'Guest'];

/** Admin works only for staff, including roles made on «Права доступу»; a customer sees "no access". */
export const isStaff = (user: SessionUser): boolean =>
  user.roles.some((role) => !outsiderRoles.includes(role));

/**
 * «Права доступу»: may the user do this on the page? Seeing comes first: no action without «view».
 * The director may do everything.
 */
export const canAccess = (
  user: Pick<SessionUser, 'access'>,
  page: string,
  action: AccessAction = 'view',
): boolean => {
  if (user.access.allowAll) return true;
  const actions = user.access.grants[page] ?? [];
  return actions.includes('view') && actions.includes(action);
};

/** «Користувачі», «Права доступу», «Налаштування ШІ»: Admin (the director also holds Admin). */
export const canManageUsers = (user: SessionUser): boolean => user.roles.includes('Admin');

/** «Бухгалтерія»: the page right (only the director by default). */
export const canUseAccounting = (user: SessionUser): boolean => canAccess(user, 'accounting');

/** «Бухгалтерія → Рахунки на закупку»: the page right (only the director by default). */
export const canUsePurchaseInvoices = (user: SessionUser): boolean =>
  canAccess(user, 'purchase-invoices');

/** The strongest role's title, for the header menu: built-in first, then a role made on «Права доступу». */
export const sessionRoleLabel = (user: SessionUser): string => {
  const titles = user.access.roles;
  const builtIn = builtInStaffRoles
    .map((name) => titles.find((role) => role.name === name))
    .find((role) => role !== undefined);
  return (builtIn ?? titles.find((role) => !role.builtIn))?.title ?? '';
};
