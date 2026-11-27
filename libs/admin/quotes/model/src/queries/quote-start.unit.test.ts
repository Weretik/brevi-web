import { describe, expect, it } from 'vitest';

import { quoteStartPrefillOf, readQuoteStartPrefill } from './quote-start';

describe('«Нове КП» prefill', () => {
  it('fills the company, recipient and client link from a chosen client', () => {
    expect(
      quoteStartPrefillOf(' Агроресурс ', {
        publicId: 'c1',
        name: 'Агроресурс',
        companyName: 'ТОВ «Агроресурс»',
        contactName: 'Марина',
      }),
    ).toEqual({
      internalName: 'Агроресурс',
      companyName: 'ТОВ «Агроресурс»',
      recipientName: 'Марина',
      customerPublicId: 'c1',
    });
  });

  it('keeps a typed name without a client', () => {
    expect(quoteStartPrefillOf('Запит на фартухи', null)).toEqual({
      internalName: 'Запит на фартухи',
      companyName: '',
      recipientName: '',
      customerPublicId: null,
    });
  });

  it('reads only a prefill from router state', () => {
    expect(readQuoteStartPrefill(null)).toBeNull();
    expect(readQuoteStartPrefill({ notice: 'x' })).toBeNull();
    expect(readQuoteStartPrefill({ prefill: { internalName: 'Агро', companyName: 5 } })).toEqual({
      internalName: 'Агро',
      companyName: '',
      recipientName: '',
      customerPublicId: null,
    });
  });
});
