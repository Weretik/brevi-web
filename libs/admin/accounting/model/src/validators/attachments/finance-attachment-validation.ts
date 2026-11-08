import {
  financeAttachmentLimits,
  financeAttachmentTypes,
} from '../../entities/attachments/finance-attachment';

const extensions = /\.(pdf|jpe?g|png)$/i;

/** Why the picked file is not taken, or null; the server checks its content as well. */
export function financeAttachmentFileProblem(file: {
  name: string;
  size: number;
  type: string;
}): string | null {
  if (file.size <= 0) return 'Файл порожній.';
  if (file.size > financeAttachmentLimits.maxBytes) return 'Файл більший за 10 МБ.';
  const known = (financeAttachmentTypes as readonly string[]).includes(file.type);
  if (!known && !extensions.test(file.name)) return 'Підходять лише PDF, JPG або PNG.';
  return null;
}
