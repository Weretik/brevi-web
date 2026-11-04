import { describe, expect, it } from 'vitest';

import { quoteSettingsErrors } from './quote-settings-validation';
import { quoteSettingsToDraft } from '../mappers/quote-settings-draft-mapper';

import type { QuoteSettings } from '../entities/quote-settings';

const settings: QuoteSettings = {
  version: 0,
  updatedByName: null,
  updatedAt: null,
  company: {
    name: 'ПП «Бреві»',
    edrpou: '35521636',
    taxId: '355216316015',
    iban: 'UA63 305299 00000 26004041206862',
    address: null,
    phone: '+38 095 164 58 55',
    email: 'pp.brevi@gmail.com',
    site: 'https://brevi.com.ua/',
    logoUrl: null,
  },
  email: { subject: 'КП № {quoteNumber}', body: 'Добрий день' },
  pdf: {
    title: 'КОМЕРЦІЙНА ПРОПОЗИЦІЯ',
    vatNotice: null,
    ctaTitle: null,
    ctaText: null,
    ctaContactTemplate: null,
  },
  introduction: {
    logoText: null,
    summerTitle: null,
    winterTitle: null,
    subtitle: null,
    summerBannerUrl: null,
    winterBannerUrl: null,
    modelsTitle: null,
    assortmentLinkText: null,
    assortmentUrl: null,
    productButtonText: null,
    nextStepText: null,
    accentColor: '#E8780F',
    summerMainCode: '',
    winterMainCode: '',
    advantages: Array.from({ length: 5 }, (_, index) => ({
      title: `Перевага ${index}`,
      text: null,
    })),
  },
  letterVariants: [{ name: 'Короткий', subject: 'КП', body: 'Текст' }],
  staffContacts: [
    {
      userId: 7,
      accountName: 'Оля',
      accountEmail: 'olia@brevi.ua',
      name: 'Ольга',
      phone: null,
      email: null,
    },
  ],
};

describe('quoteSettingsErrors', () => {
  it('accepts the defaults and turns nulls into empty fields', () => {
    const draft = quoteSettingsToDraft(settings);
    expect(draft.company.address).toBe('');
    expect(draft.staffContacts[0]?.userId).toBe(7);
    expect(quoteSettingsErrors(draft)).toEqual({});
  });

  it('shows the server rules next to the field', () => {
    const draft = quoteSettingsToDraft(settings);
    draft.company.edrpou = '123';
    draft.company.logoUrl = '/brand/logo.svg';
    draft.introduction.accentColor = 'orange';
    draft.introduction.advantages = draft.introduction.advantages.slice(1);
    const letterKey = draft.letterVariants[0]?.key ?? '';
    draft.letterVariants[0] = { key: letterKey, name: ' ', subject: 'КП', body: 'Текст' };
    draft.staffContacts[0] = { ...draft.staffContacts[0]!, email: 'olia@' };

    const errors = quoteSettingsErrors(draft);
    expect(errors['company.edrpou']).toBe('ЄДРПОУ — 8 цифр.');
    expect(errors['company.logoUrl']).toContain('https://');
    expect(errors['introduction.accentColor']).toBeDefined();
    expect(errors['introduction.advantages']).toBe('Потрібно 5 переваг.');
    expect(errors[`letter:${letterKey}.name`]).toBe('Обовʼязкове поле.');
    expect(errors['staff:7.email']).toBe('Невірна адреса пошти.');
  });

  it('stops a mark the server does not know before it reaches the client', () => {
    const draft = quoteSettingsToDraft(settings);
    draft.email.body = 'З повагою, {managerNmae}';
    draft.pdf.ctaContactTemplate = 'Телефон: {managerPhone}';

    const errors = quoteSettingsErrors(draft);
    expect(errors['email.body']).toBe(
      'Невідома мітка {managerNmae}. Вставте мітку кнопкою під полем.',
    );
    expect(errors['pdf.ctaContactTemplate']).toBeUndefined();
  });
});
