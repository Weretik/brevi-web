export const redirectLimits = { path: 500, note: 200 } as const;

export interface RedirectFormValues {
  fromPath: string;
  toPath: string;
  note: string;
}

export type RedirectErrors = Partial<Record<keyof RedirectFormValues, string>>;

/** The path of an address as the server compares it; null for an empty address or the site root. */
export function redirectPath(address: string): string | null {
  let value = address.trim();
  if (value === '') return null;
  const scheme = /^https?:\/\/[^/]*/i.exec(value);
  if (scheme) value = value.slice(scheme[0].length);
  value = value.split(/[?#]/)[0] ?? '';
  try {
    value = decodeURIComponent(value);
  } catch {
    return null;
  }
  const parts = value.split('/').filter(Boolean);
  return parts.length === 0 ? null : `/${parts.join('/').toLowerCase()}`;
}

const isSitePath = (path: string) =>
  ['/uk', '/ru'].some((locale) => path === locale || path.startsWith(`${locale}/`));

/** Checks the side panel before saving; the server checks the same and more. */
export function validateRedirect(values: RedirectFormValues): RedirectErrors {
  const errors: RedirectErrors = {};
  const from = redirectPath(values.fromPath);
  const to = redirectPath(values.toPath);
  if (from === null || /\s/.test(from) || from.length > redirectLimits.path)
    errors.fromPath = 'Вкажіть стару адресу, наприклад /specodyag-litnij.';
  if (to === null || !isSitePath(to) || /\s/.test(to) || to.length > redirectLimits.path)
    errors.toPath = 'Вкажіть сторінку нового сайту, що починається з /uk або /ru.';
  else if (from !== null && from === to) errors.toPath = 'Стара і нова адреси однакові.';
  if (values.note.trim().length > redirectLimits.note)
    errors.note = `Примітка — не більше ${redirectLimits.note} символів.`;
  return errors;
}
