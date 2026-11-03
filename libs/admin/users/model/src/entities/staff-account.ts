/** Director is the single owner account; the server also gives it Admin. */
export type StaffRole = 'Director' | 'Admin' | 'Accountant' | 'Manager';

export interface StaffAccount {
  id: number;
  email: string;
  fullName: string;
  role: StaffRole;
  isBlocked: boolean;
}

export interface CreateStaffAccountInput {
  email: string;
  fullName: string;
  role: StaffRole;
  password: string;
}

export const staffRoles: readonly StaffRole[] = ['Manager', 'Accountant', 'Admin', 'Director'];

export const staffRoleLabels: Record<StaffRole, string> = {
  Director: 'Директор',
  Admin: 'Адміністратор',
  Accountant: 'Бухгалтер',
  Manager: 'Менеджер',
};
