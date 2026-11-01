import { mapEmailTemplateSettings } from './email-template-registry.mapper';

import type { EmailTemplateView } from '@admin/clients/model';

export function mapActiveEmailTemplate(value: unknown): EmailTemplateView | null {
  const active = mapEmailTemplateSettings(value).active;
  return active ? { id: active.id, number: active.number, label: active.label } : null;
}
