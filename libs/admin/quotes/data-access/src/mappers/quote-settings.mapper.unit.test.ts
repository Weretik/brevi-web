import { quoteSettingsToDraft } from '@admin/quotes/model';
import { describe, expect, it } from 'vitest';

import { mapQuoteSettings, toSaveQuoteSettingsInput } from './quote-settings.mapper';

import type { components } from '@admin/shared/contracts';

const response: components['schemas']['CrmQuoteSettings'] = {
  version: 3,
  company: { name: 'ПП «Бреві»', edrpou: '35521636', site: 'https://brevi.com.ua/' },
  email: { subject: 'КП № {quoteNumber}', body: 'Добрий день' },
  pdf: { title: 'КОМЕРЦІЙНА ПРОПОЗИЦІЯ' },
  introduction: { advantages: [{ title: 'Своє виробництво' }] },
  letterVariants: [{ name: 'Короткий', subject: 'КП', body: 'Текст' }],
  staffContacts: [{ userId: 7, accountName: 'Оля', name: 'Ольга', phone: '+380 50 000 00 00' }],
};

describe('quote settings mapper', () => {
  it('fills missing fields with null', () => {
    const settings = mapQuoteSettings(response);
    expect(settings.company.taxId).toBeNull();
    expect(settings.introduction.accentColor).toBeNull();
    expect(settings.introduction.advantages[0]).toEqual({ title: 'Своє виробництво', text: null });
    expect(settings.staffContacts[0]?.email).toBeNull();
  });

  it('trims fields and sends empty ones as null', () => {
    const draft = quoteSettingsToDraft(mapQuoteSettings(response));
    draft.company.address = '   ';
    draft.company.name = ' ПП «Бреві» ';
    draft.staffContacts[0] = { ...draft.staffContacts[0]!, email: ' olia@brevi.ua ' };

    const input = toSaveQuoteSettingsInput(draft);
    expect(input.version).toBe(3);
    expect(input.company.name).toBe('ПП «Бреві»');
    expect(input.company.address).toBeNull();
    expect(input.introduction.advantages[0]?.text).toBeNull();
    expect(input.letterVariants).toEqual([{ name: 'Короткий', subject: 'КП', body: 'Текст' }]);
    expect(input.staffContacts[0]).toEqual({
      userId: 7,
      name: 'Ольга',
      phone: '+380 50 000 00 00',
      email: 'olia@brevi.ua',
    });
  });
});
