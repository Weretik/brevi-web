import {
  REQUEST_ATTACHMENT_EXTENSIONS,
  REQUEST_ATTACHMENT_MAX_BYTES,
  REQUEST_FIELD_LIMITS,
} from '../request-form';

import type {
  RequestFieldError,
  RequestFieldErrors,
  RequestFormValues,
  RequestTextField,
} from '../request-form';

/**
 * Brings a Ukrainian mobile or city number to `+380XXXXXXXXX`.
 * Accepts `050 123 45 67`, `80501234567`, `380501234567`, and `+38 (050) 123-45-67`; anything else is `null`.
 */
export function normalizeUkrainianPhone(input: string): string | null {
  if (/[^\d\s()+\-.]/.test(input)) return null;
  const digits = input.replace(/\D/g, '');
  const national =
    digits.length === 12 && digits.startsWith('380')
      ? digits.slice(3)
      : digits.length === 11 && digits.startsWith('80')
        ? digits.slice(2)
        : digits.length === 10 && digits.startsWith('0')
          ? digits.slice(1)
          : null;
  if (!national || national.startsWith('0')) return null;
  return `+380${national}`;
}

/** `+380501234567` → `+380 50 123 45 67`. */
export function formatUkrainianPhone(e164: string): string {
  const match = /^\+380(\d{2})(\d{3})(\d{2})(\d{2})$/.exec(e164);
  return match ? `+380 ${match[1]} ${match[2]} ${match[3]} ${match[4]}` : e164;
}

/** Trims every field and collapses spaces in the one-line ones. */
export function cleanRequestValues(values: RequestFormValues): RequestFormValues {
  const line = (value: string) => value.replace(/\s+/g, ' ').trim();
  return {
    phone: line(values.phone),
    workwear: line(values.workwear),
    quantity: line(values.quantity),
    comment: values.comment.trim(),
  };
}

/** Checks the size and the extension of an attached brief or layout; `undefined` when the file is fine. */
export function validateRequestAttachment(file: {
  name: string;
  size: number;
}): RequestFieldError | undefined {
  if (file.size > REQUEST_ATTACHMENT_MAX_BYTES) return 'fileTooLarge';
  const name = file.name.toLowerCase();
  return REQUEST_ATTACHMENT_EXTENSIONS.some((extension) => name.endsWith(extension))
    ? undefined
    : 'fileType';
}

/** Expects cleaned values. Returns an empty object when the request can be sent. */
export function validateRequest(
  values: RequestFormValues,
  attachment?: { name: string; size: number },
): RequestFieldErrors {
  const errors: RequestFieldErrors = {};
  for (const field of Object.keys(REQUEST_FIELD_LIMITS) as RequestTextField[]) {
    if (values[field].length > REQUEST_FIELD_LIMITS[field]) errors[field] = 'tooLong';
  }
  if (!values.phone) errors.phone = 'required';
  else if (!errors.phone && !normalizeUkrainianPhone(values.phone)) errors.phone = 'invalidPhone';
  const fileError = attachment ? validateRequestAttachment(attachment) : undefined;
  if (fileError) errors.attachment = fileError;
  return errors;
}
