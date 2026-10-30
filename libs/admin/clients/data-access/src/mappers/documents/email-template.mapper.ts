import {
  quoteDate,
  quoteId,
  quoteInteger,
  quoteRecord,
  quoteText,
} from '../../validators/quotes/quote-response-values';

import type { EmailTemplateView } from '@admin/clients/model';

export function mapActiveEmailTemplate(value: unknown): EmailTemplateView | null {
  const settings = quoteRecord(value);
  quoteInteger(settings['revision']);
  if (settings['active'] === null) return null;
  const row = quoteRecord(settings['active']);
  const label = quoteText(row['name']);
  const subject = quoteText(row['subject']);
  const body = quoteText(row['body']);
  if (
    !label.trim() ||
    label.length > 120 ||
    !subject.trim() ||
    subject.length > 200 ||
    /[\r\n]/.test(subject) ||
    !body.trim() ||
    body.length > 3000
  )
    throw new Error('Некоректний шаблон листа.');
  quoteDate(row['createdAt']);
  return { id: quoteId(row['versionId']), number: quoteInteger(row['number']), label };
}
