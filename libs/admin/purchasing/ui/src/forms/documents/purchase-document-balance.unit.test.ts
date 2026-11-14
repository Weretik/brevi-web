import { describe, expect, it } from 'vitest';

import { purchaseDocumentBalanceText } from './purchase-document-balance';

describe('purchaseDocumentBalanceText', () => {
  it('waits until every sum is a number', () => {
    expect(purchaseDocumentBalanceText({ linesKopecks: null, balanced: false }, false)).toBe(
      'Сума позицій порахується, коли всі суми будуть числами.',
    );
  });

  it('says whether the positions plus VAT match «До оплати»', () => {
    const text = purchaseDocumentBalanceText({ linesKopecks: 120000, balanced: true }, true);
    expect(text).toMatch(/^Позиції \+ ПДВ: .+ грн — збігається з «До оплати»\.$/);
    expect(purchaseDocumentBalanceText({ linesKopecks: 100, balanced: false }, false)).toMatch(
      /^Сума позицій: .+ грн — не збігається з «До оплати»\.$/,
    );
  });
});
