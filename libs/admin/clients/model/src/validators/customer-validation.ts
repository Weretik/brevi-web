import type { ContactDraft } from '../models/contact-draft';
import type { CustomerDraft } from '../models/customer-draft';

export function customerErrors(draft: CustomerDraft): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!draft.displayName.trim()) errors['displayName'] = 'Вкажіть назву клієнта.';
  if (draft.displayName.length > 300) errors['displayName'] = 'До 300 символів.';
  if (draft.legalName.length > 500) errors['legalName'] = 'До 500 символів.';
  if (draft.taxIdentity.length > 80) errors['taxIdentity'] = 'До 80 символів.';
  return errors;
}
export function contactErrors(draft: ContactDraft): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!draft.name.trim() || draft.name.length > 300)
    errors['name'] = 'Вкажіть ім’я контакту (до 300 символів).';
  if (draft.position.length > 200) errors['position'] = 'До 200 символів.';
  if (draft.channels.length > 10) errors['channels'] = 'Не більше 10 каналів зв’язку.';
  for (const [index, channel] of draft.channels.entries()) {
    const value = channel.value.trim();
    if (
      channel.kind === 'email' &&
      (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length > 254)
    )
      errors[`channel.${index}`] = 'Перевірте email.';
    if (
      channel.kind === 'phone' &&
      (value.length > 80 ||
        value.replace(/\D/g, '').length < 5 ||
        value.replace(/\D/g, '').length > 20)
    )
      errors[`channel.${index}`] = 'Перевірте номер телефону.';
  }
  return errors;
}
