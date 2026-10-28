import { quotePriceIntent } from './quote-price-intent';

import type { QuoteDraft } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

type Content =
  operations['createCrmQuote']['requestBody']['content']['application/json']['content'];
export function quoteContent(draft: QuoteDraft): Content {
  return {
    items: draft.items.map((item, sortOrder) => ({
      publicId: item.publicId ?? null,
      sortOrder,
      title: item.title,
      publicDescription: item.publicDescription,
      publicComment: item.publicComment,
      internalNote: item.internalNote,
      included: item.included,
      variants: item.variants.map((variant, variantOrder) => ({
        publicId: variant.publicId ?? null,
        sortOrder: variantOrder,
        title: variant.title,
        visible: variant.visible,
        priceIntent: quotePriceIntent(variant.selection),
        basisToken: variant.basis?.origin === 'preview' ? variant.basis.value.token : null,
        tierVisibility: { ...variant.tierVisibility },
      })),
    })),
  };
}
