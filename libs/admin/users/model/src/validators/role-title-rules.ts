import { roleTitleMaxLength } from '../entities/access-rights';

/** «Назва ролі»: 1–100 characters after trimming. Returns the error text or null. */
export const validateRoleTitle = (title: string): string | null => {
  const value = title.trim();
  if (value.length === 0) return 'Вкажіть назву ролі.';
  if (value.length > roleTitleMaxLength) {
    return `Назва ролі — не більше ${roleTitleMaxLength} символів.`;
  }
  return null;
};
