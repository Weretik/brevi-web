import type { QuoteDetail } from '@admin/clients/model';

export function quoteDetailFixture(): QuoteDetail {
  return {
    publicId: '11111111-1111-4111-8111-111111111111',
    versionId: '22222222-2222-4222-8222-222222222222',
    sourceQuoteId: null,
    sourceVersionId: null,
    revision: 1,
    versionNumber: 1,
    state: 'draft',
    archived: false,
    number: null,
    ownerId: 17,
    versionActorId: 17,
    updatedAt: '2026-10-28T12:00:00Z',
    canEdit: true,
    draft: {
      customerId: null,
      contactId: null,
      recipientName: 'Одержувач',
      items: [
        {
          key: 'item',
          publicId: '33333333-3333-4333-8333-333333333333',
          title: 'Позиція',
          publicDescription: 'Збережений опис',
          publicComment: '',
          internalNote: 'Внутрішнє',
          included: true,
          variants: [
            {
              key: 'variant',
              publicId: '44444444-4444-4444-8444-444444444444',
              title: 'Варіант',
              visible: true,
              selection: { kind: 'ppe', productId: 42 },
              tierVisibility: { retail: true, wholesale: true, largeWholesale: true },
              basis: {
                origin: 'saved',
                value: {
                  token: 'saved',
                  expiresAt: 0,
                  selection: { kind: 'ppe', productId: 42 },
                  retail: 100,
                  wholesale: 90,
                  largeWholesale: 80,
                  blockers: [],
                  currency: 'UAH',
                  taxBasis: 'catalog_no_extra_vat',
                  source: {
                    sourceId: '55555555-5555-4555-8555-555555555555',
                    calculationId: null,
                    ruleVersionId: null,
                    compositionVersion: null,
                    settingsVersionId: null,
                    referenceVersionIds: [1],
                    formulaVersion: 'v1',
                  },
                },
              },
            },
          ],
        },
      ],
    },
  };
}
