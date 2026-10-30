import { describe, expect, it } from 'vitest';

import { quoteContent } from './quote-content.mapper';
import { mapQuoteDetail } from './quote-detail.mapper';
import { quotePriceIntent } from './quote-price-intent';
import { mapQuoteBasis } from './quote-price.mapper';

const quoteId = '11111111-1111-4111-8111-111111111111';
const versionId = '22222222-2222-4222-8222-222222222222';
const itemId = '33333333-3333-4333-8333-333333333333';
const variantId = '44444444-4444-4444-8444-444444444444';
const token = '55555555-5555-4555-8555-555555555555';
const at = '2026-10-27T12:00:00Z';
function fixture() {
  const basis = {
    basisToken: token,
    expiresAt: at,
    intent: { kind: 'sewing', productId: 25, articleId: 246 },
    source: {
      kind: 'sewing',
      productId: 25,
      articleId: 246,
      sourceId: versionId,
      formulaVersion: 'sewing-sheet-v1',
      referenceVersionIds: [11, 12],
    },
    retail: 100,
    wholesale: 90,
    largeWholesale: 80,
    blockers: [],
    currency: 'UAH',
    taxBasis: 'catalog_no_extra_vat',
  };
  return {
    publicId: quoteId,
    recipientName: 'Одержувач',
    revision: 1,
    state: 'draft',
    archived: false,
    number: null,
    ownerId: 17,
    createdAt: at,
    updatedAt: at,
    canEdit: true,
    version: {
      publicId: versionId,
      versionNumber: 1,
      action: 'created',
      recipientName: 'Одержувач',
      customerPublicId: null,
      contactPublicId: null,
      currency: 'UAH',
      taxBasis: 'no_extra_vat',
      actorId: 17,
      createdAt: at,
      items: [
        {
          publicId: itemId,
          sortOrder: 0,
          title: 'Позиція',
          included: true,
          publicDescription: 'Опис',
          publicComment: '',
          internalNote: 'Приватно',
          variants: [
            {
              publicId: variantId,
              sortOrder: 0,
              title: 'Артикул',
              kind: 'sewing',
              productId: 25,
              articleId: 246,
              visible: true,
              priceBasis: basis,
              tiers: [
                { code: 'retail', amount: 100, visible: true, currency: 'UAH' },
                { code: 'wholesale', amount: 90, visible: false, currency: 'UAH' },
                { code: 'largeWholesale', amount: 80, visible: true, currency: 'UAH' },
              ],
            },
          ],
        },
      ],
    },
  };
}

describe('quote response boundary (SC-Q01/02/07)', () => {
  it('retains the current version identity for an explicit lifecycle confirmation', () => {
    expect(mapQuoteDetail(fixture())).toMatchObject({ versionId });
  });
  it('retains typed source versions for the old/new comparison', () => {
    const basis = mapQuoteDetail(fixture()).draft.items[0].variants[0].basis!.value;
    expect(basis.source).toMatchObject({
      sourceId: versionId,
      referenceVersionIds: [11, 12],
      formulaVersion: 'sewing-sheet-v1',
    });
  });
  it.each(['recalculated', 'copied'])(
    'reopens the pinned P3 %s snapshot without repricing',
    (action) => {
      const response = fixture();
      response.version.action = action;
      const detail = mapQuoteDetail(response);
      expect(detail.draft.items[0].variants[0].basis?.value.retail).toBe(100);
      expect(detail.draft.items[0].variants[0].basis?.origin).toBe('saved');
    },
  );

  it('continues to reject unknown version actions', () => {
    const response = fixture();
    response.version.action = 'unknown';
    expect(() => mapQuoteDetail(response)).toThrow('Невідома схема версії КП.');
  });

  it('restores item and alternative order from sortOrder without mutating the wire arrays', () => {
    const response = fixture();
    const first = response.version.items[0];
    const original = first.variants[0];
    first.variants = [
      { ...original, publicId: '66666666-6666-4666-8666-666666666666', sortOrder: 1 },
      original,
    ];
    response.version.items = [
      { ...first, publicId: '77777777-7777-4777-8777-777777777777', sortOrder: 1, variants: [] },
      first,
    ];
    const mapped = mapQuoteDetail(response);
    expect(mapped.draft.items[0].publicId).toBe(itemId);
    expect(mapped.draft.items[0].variants[0].publicId).toBe(variantId);
    expect(response.version.items[0].sortOrder).toBe(1);
    expect(first.variants[0].sortOrder).toBe(1);
  });
  it('rejects ambiguous duplicate ordering positions', () => {
    const response = fixture();
    const first = response.version.items[0];
    response.version.items.push({
      ...first,
      publicId: '77777777-7777-4777-8777-777777777777',
      variants: [],
    });
    expect(() => mapQuoteDetail(response)).toThrow();
  });
  it('maps one-off manual intent separately from Catalog references without calculated totals', () => {
    const selection = {
      kind: 'oneOffPpe' as const,
      prices: { retail: 250, wholesale: 225, largeWholesale: 200, reason: 'Разово' },
    };
    const intent = quotePriceIntent(selection);
    expect(intent).toEqual({
      kind: 'oneOffPpe',
      productId: null,
      articleId: null,
      override: null,
      manualPrices: selection.prices,
    });
    const basis = mapQuoteBasis({
      basisToken: token,
      expiresAt: at,
      intent,
      source: null,
      retail: 250,
      wholesale: 225,
      largeWholesale: 200,
      blockers: [],
      currency: 'UAH',
      taxBasis: 'manual_no_extra_vat',
    });
    expect(basis.selection).toEqual(selection);
  });
  it('reopens saved prices/text/visibility and omits historical tokens from text-only saves', () => {
    const detail = mapQuoteDetail(fixture());
    expect(detail.draft.items[0].internalNote).toBe('Приватно');
    expect(detail.draft.items[0].variants[0].tierVisibility.wholesale).toBe(false);
    expect(detail.draft.items[0].variants[0].basis?.value.retail).toBe(100);
    expect(quoteContent(detail.draft).items[0].variants[0].basisToken).toBeNull();
  });

  it('rejects duplicate tiers instead of silently losing a semantic price', () => {
    const response = fixture();
    const tiers = response.version.items[0].variants[0].tiers;
    tiers[1] = { ...tiers[0] };
    expect(() => mapQuoteDetail(response)).toThrow();
  });

  it('rejects a variant selection that differs from the frozen price basis', () => {
    const response = fixture();
    response.version.items[0].variants[0].articleId = 247;
    expect(() => mapQuoteDetail(response)).toThrow();
  });

  it('requires source provenance for catalog price responses', () => {
    const basis = fixture().version.items[0].variants[0].priceBasis;
    expect(() => mapQuoteBasis({ ...basis, source: null })).toThrow();
  });

  it('retains null prices and blocks unknown kinds, dates and tax bases', () => {
    const basis = fixture().version.items[0].variants[0].priceBasis;
    expect(
      mapQuoteBasis({ ...basis, retail: null, blockers: ['MissingPublication'] }).retail,
    ).toBeNull();
    expect(() => mapQuoteBasis({ ...basis, intent: { kind: 'legacy' } })).toThrow();
    expect(() => mapQuoteBasis({ ...basis, expiresAt: 'bad-date' })).toThrow();
    expect(() => mapQuoteBasis({ ...basis, taxBasis: 'vat_extra' })).toThrow();
  });
});
