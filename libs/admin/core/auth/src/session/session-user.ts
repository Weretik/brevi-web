/** The director also holds Admin. */
export type SessionRole =
  'Director' | 'Admin' | 'Accountant' | 'Manager' | 'WorkshopChief' | 'User';

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  roles: readonly SessionRole[];
  /** Photo on the CDN; null shows the first letter of the name on a color. */
  avatarUrl: string | null;
}

/** Admin works only for staff; a customer account signed in here sees "no access". */
const staffRoles: readonly SessionRole[] = [
  'Director',
  'Admin',
  'Accountant',
  'Manager',
  'WorkshopChief',
];

export const isStaff = (user: SessionUser): boolean =>
  user.roles.some((role) => staffRoles.includes(role));

export const canManageUsers = (user: SessionUser): boolean => user.roles.includes('Admin');

/** «Швейний цех»: the head of the workshop; Admin and the director (who also holds Admin). */
export const canManageWorkshop = (user: SessionUser): boolean =>
  user.roles.includes('Admin') || user.roles.includes('WorkshopChief');

/** «Рахунки на закупку»: the accountant and Admin (the director also holds Admin), not the manager. */
export const canUsePurchaseInvoices = (user: SessionUser): boolean =>
  user.roles.includes('Admin') || user.roles.includes('Accountant');

const roleLabels: Record<Exclude<SessionRole, 'User'>, string> = {
  Director: 'Директор',
  Admin: 'Адміністратор',
  Accountant: 'Бухгалтер',
  Manager: 'Менеджер',
  WorkshopChief: 'Начальник цеху',
};

/** The strongest staff role in Ukrainian, for the header menu. */
export const sessionRoleLabel = (user: SessionUser): string => {
  const role = staffRoles.find((item) => user.roles.includes(item));
  return role && role !== 'User' ? roleLabels[role] : '';
};
