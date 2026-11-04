import type { StaffDetailsInput } from '../entities/staff-account';

/** Match the server rules in ProfileRules. */
export const fullNameMaxLength = 100;
export const phoneMaxLength = 20;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateFullName = (value: string): string | undefined => {
  const name = value.trim();
  if (!name) return 'Вкажіть імʼя.';
  return name.length > fullNameMaxLength
    ? `Імʼя має бути не довше ${fullNameMaxLength} символів.`
    : undefined;
};

export const validateStaffEmail = (value: string): string | undefined =>
  emailPattern.test(value.trim()) ? undefined : 'Вкажіть коректний email.';

/** Optional: 7 to 15 digits, a leading +, spaces, dashes and brackets are allowed. */
export const validatePhoneNumber = (value: string): string | undefined => {
  const phone = value.trim();
  if (!phone) return undefined;

  const digits = phone.replace(/\D/g, '').length;
  const allowed = /^\+?[\d\s()-]+$/.test(phone);
  return allowed && phone.length <= phoneMaxLength && digits >= 7 && digits <= 15
    ? undefined
    : 'Вкажіть телефон: 7–15 цифр, можна з +, пробілами, дужками та дефісами.';
};

export type StaffDetailsFieldErrors = Partial<Record<keyof StaffDetailsInput, string>>;

export const validateStaffDetails = (input: StaffDetailsInput): StaffDetailsFieldErrors => {
  const errors: StaffDetailsFieldErrors = {
    fullName: validateFullName(input.fullName),
    email: validateStaffEmail(input.email),
    phoneNumber: validatePhoneNumber(input.phoneNumber),
  };

  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => message !== undefined),
  ) as StaffDetailsFieldErrors;
};
