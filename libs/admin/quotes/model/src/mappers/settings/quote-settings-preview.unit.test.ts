import { describe, expect, it } from 'vitest';

import { quoteSettingsPreviewSample } from './quote-settings-preview';

import type { QuoteSettingsDraft } from '../../forms/settings/quote-settings-draft';

describe('quoteSettingsPreviewSample', () => {
  it('fills empty КП contacts from the account and the site without https', () => {
    const draft = {
      company: { phone: '+380 44 000 00 00', site: 'https://brevi.com.ua/' },
      staffContacts: [
        {
          userId: 7,
          accountName: 'Оля',
          accountEmail: 'olia@brevi.ua',
          name: '',
          phone: '',
          email: '',
          mailboxEmail: '',
        },
      ],
    } as unknown as QuoteSettingsDraft;

    const sample = quoteSettingsPreviewSample(draft, new Date(2026, 10, 4));

    expect(sample.number).toBe('12-11-2026');
    expect(sample.marks).toEqual({
      '{quoteNumber}': '12-11-2026',
      '{clientName}': 'Олена Коваль',
      '{companyName}': 'ТОВ «Приклад»',
      '{managerName}': 'Оля',
      '{managerPhone}': '+380 44 000 00 00',
      '{managerEmail}': 'olia@brevi.ua',
      '{site}': 'brevi.com.ua',
      '{recipient}': 'для ТОВ «Приклад»',
      '{sewingModel}': 'Куртка робоча «Імпульс»',
      '{fabricName}': '«Грета»',
      '{ppeItem}': 'рукавиці захисні',
    });
  });
});
