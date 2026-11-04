/** Director is the single owner account; the server also gives it Admin. */
export type StaffRole = 'Director' | 'Admin' | 'Accountant' | 'Manager' | 'WorkshopChief';

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

export const staffRoles: readonly StaffRole[] = [
  'Manager',
  'WorkshopChief',
  'Accountant',
  'Admin',
  'Director',
];

export const staffRoleLabels: Record<StaffRole, string> = {
  Director: 'Директор',
  Admin: 'Адміністратор',
  Accountant: 'Бухгалтер',
  Manager: 'Менеджер',
  WorkshopChief: 'Начальник цеху',
};
