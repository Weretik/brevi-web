import type { QuotePriceSelection } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

type Intent =
  operations['previewCrmQuotePrices']['requestBody']['content']['application/json']['intent'];
export function quotePriceIntent(selection: QuotePriceSelection): Intent {
  if (selection.kind === 'sewing')
    return {
      kind: 'sewing',
      productId: selection.productId,
      articleId: selection.articleId,
      override: null,
      manualPrices: null,
    };
  if (selection.kind === 'ppe')
    return {
      kind: 'ppe',
      productId: selection.productId,
      articleId: null,
      override: selection.override ? { ...selection.override } : null,
      manualPrices: null,
    };
  return {
    kind: 'oneOffPpe',
    productId: null,
    articleId: null,
    override: null,
    manualPrices: { ...selection.prices },
  };
}
