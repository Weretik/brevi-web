import type { QuoteMark, QuoteSettingsDraft } from '../models/quote-settings-draft';

export interface QuoteSettingsPreviewSample {
  readonly number: string;
  readonly date: string;
  readonly client: string;
  readonly managerName: string;
  readonly managerEmail: string;
  /** Values of the marks as they would be filled in this example. */
  readonly marks: Readonly<Record<QuoteMark, string>>;
}

const siteText = (site: string) =>
  site
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');

/**
 * An example КП for the settings preview: a number of this month, the first manager with their account
 * contacts where the КП fields are empty, and the company site.
 */
export function quoteSettingsPreviewSample(
  draft: QuoteSettingsDraft,
  today: Date = new Date(),
): QuoteSettingsPreviewSample {
  const manager = draft.staffContacts[0];
  const managerName = manager?.name.trim() || manager?.accountName || 'Ім’я менеджера';
  const managerEmail = manager?.email.trim() || manager?.accountEmail || 'manager@brevi.com.ua';
  const managerPhone = manager?.phone.trim() || draft.company.phone.trim() || '+380 00 000 00 00';
  const number = `12-${today.getMonth() + 1}-${today.getFullYear()}`;
  return {
    number,
    date: today.toLocaleDateString('uk-UA'),
    client: 'ТОВ «Приклад» · Олена Коваль',
    managerName,
    managerEmail,
    marks: {
      '{quoteNumber}': number,
      '{clientName}': 'Олена Коваль',
      '{companyName}': 'ТОВ «Приклад»',
      '{managerName}': managerName,
      '{managerPhone}': managerPhone,
      '{managerEmail}': managerEmail,
      '{site}': siteText(draft.company.site) || 'brevi.com.ua',
      '{recipient}': 'для ТОВ «Приклад»',
      '{sewingModel}': 'Куртка робоча «Імпульс»',
      '{fabricName}': '«Грета»',
      '{ppeItem}': 'рукавиці захисні',
    },
  };
}
