import { isFixedPriceKind, parseQuotePrice, quoteTiers } from '@admin/quotes/model';

import type { QuoteDraft, QuoteOptionDraft, QuotePriceDraft } from '@admin/quotes/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

const text = (value: string): string | null => (value.trim() ? value.trim() : null);

const priceInput = (price: QuotePriceDraft, sewing: boolean): Schemas['CrmQuotePriceInput'] => {
  const manual = sewing || !price.manual.trim() ? null : parseQuotePrice(price.manual);
  return { shown: price.shown, manual: manual !== null && manual !== price.source ? manual : null };
};

const optionInput = (option: QuoteOptionDraft, sewing: boolean): Schemas['CrmQuoteOptionInput'] => {
  const [retail, wholesale, large] = quoteTiers.map((tier) =>
    priceInput(option.prices[tier], sewing),
  );
  return {
    id: option.id,
    articleId: option.articleId,
    isRecommended: option.isRecommended,
    retail,
    wholesale,
    large,
    manualReason: text(option.manualReason),
    fabrics:
      option.fabrics.length > 0
        ? option.fabrics.map(({ fabricId, meters }) => ({ fabricId, meters }))
        : null,
  };
};

/** The whole editor content; Catalog prices are never sent (the server keeps or takes them). */
export function toSaveQuoteInput(draft: QuoteDraft): Schemas['CrmSaveQuoteInput'] {
  return {
    version: draft.version,
    internalName: draft.internalName.trim(),
    customerId: draft.customerId,
    recipientName: text(draft.recipientName),
    companyName: text(draft.companyName),
    clientComment: text(draft.clientComment),
    managerNote: text(draft.managerNote),
    items: draft.items.map((item) => ({
      id: item.id,
      kind: item.kind,
      productId: item.productId,
      name: item.kind === 'OneOffPpe' || item.kind === 'CustomSewing' ? item.name.trim() : null,
      description: text(item.description),
      photoUrl: item.photoUrl,
      supplierUrl: text(item.supplierUrl),
      options: item.options.map((option) => optionInput(option, isFixedPriceKind(item.kind))),
      lines:
        item.kind === 'CustomSewing'
          ? item.lines.map((line) => ({
              kind: line.kind,
              referenceId: line.referenceId,
              quantity: line.quantity,
              manualMinutes: line.manualMinutes,
              costCode: line.costCode,
            }))
          : null,
    })),
  };
}
