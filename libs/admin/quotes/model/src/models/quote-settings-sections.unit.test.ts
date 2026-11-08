import { describe, expect, it } from 'vitest';

import {
  quoteSettingsChangedSections,
  quoteSettingsErrorCounts,
  quoteSettingsSectionOf,
} from './quote-settings-sections';

import type { QuoteSettingsDraft } from './quote-settings-draft';

const draft = (): QuoteSettingsDraft => ({
  version: 1,
  company: {
    name: 'ПП «Бреві»',
    edrpou: '',
    taxId: '',
    iban: '',
    address: '',
    phone: '',
    email: '',
    site: '',
    logoUrl: '',
  },
  email: { subject: 'КП', body: 'Текст' },
  pdf: {
    title: 'КП',
    vatNotice: '',
    ctaTitle: '',
    ctaText: '',
    ctaContactTemplate: '',
    intros: {
      onePpe: '',
      oneSewing: '',
      oneSewingOnePpe: '',
      sewing: '',
      ppe: '',
      sewingAndPpe: '',
      fallback: '',
    },
    labels: {
      contactLine: '',
      codeLabel: '',
      siteLink: '',
      fabricsTitle: '',
      recommended: '',
      commentTitle: '',
    },
  },
  introduction: {
    logoText: '',
    summerTitle: '',
    winterTitle: '',
    subtitle: '',
    summerBannerUrl: '',
    winterBannerUrl: '',
    modelsTitle: '',
    assortmentLinkText: '',
    assortmentUrl: '',
    productButtonText: '',
    nextStepText: '',
    accentColor: '',
    summerMainCode: '',
    winterMainCode: '',
    advantages: [],
  },
  letterVariants: [{ key: 'letter-1', name: 'Короткий', subject: 'КП', body: 'Текст' }],
  staffContacts: [
    {
      userId: 7,
      accountName: 'Оля',
      accountEmail: 'olia@brevi.ua',
      name: 'Ольга',
      phone: '',
      email: '',
      mailboxEmail: '',
    },
  ],
});

describe('quote settings sections', () => {
  it('puts every field error into its section', () => {
    expect(quoteSettingsSectionOf('letter:letter-1.body')).toBe('letters');
    expect(quoteSettingsSectionOf('advantage:2.title')).toBe('introduction');
    expect(
      quoteSettingsErrorCounts({
        'company.edrpou': 'x',
        'email.body': 'x',
        'letter:letter-1.name': 'x',
        'staff:7.email': 'x',
      }),
    ).toEqual({ company: 1, letters: 2, managers: 1 });
  });

  it('marks only the sections whose fields changed, not a new Gmail address', () => {
    const saved = draft();
    const edited = draft();
    edited.pdf.ctaText = 'Шиємо у власному цеху';
    edited.letterVariants[0] = { ...edited.letterVariants[0]!, body: 'Інший текст' };
    edited.staffContacts[0] = { ...edited.staffContacts[0]!, mailboxEmail: 'olia@gmail.com' };

    expect(quoteSettingsChangedSections(saved, edited)).toEqual(['pdf', 'letters']);
  });
});
