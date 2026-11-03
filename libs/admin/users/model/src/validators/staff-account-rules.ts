import type { CreateStaffAccountInput } from '../entities/staff-account';

/** Matches the server rule for staff passwords. */
export const minStaffPasswordLength = 8;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type StaffAccountFieldErrors = Partial<Record<keyof CreateStaffAccountInput, string>>;

export const validateStaffPassword = (password: string): string | undefined =>
  password.length < minStaffPasswordLength
    ? `Пароль має містити щонайменше ${minStaffPasswordLength} символів.`
    : undefined;

export const validateStaffAccountInput = (
  input: CreateStaffAccountInput,
): StaffAccountFieldErrors => {
  const errors: StaffAccountFieldErrors = {};

  if (!emailPattern.test(input.email.trim())) {
    errors.email = 'Вкажіть коректний email.';
  }

  if (!input.fullName.trim()) {
    errors.fullName = 'Вкажіть імʼя.';
  }

  const passwordError = validateStaffPassword(input.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
};
