import { mapQuoteSelection } from './quote-price-selection.mapper';
import {
  quoteArray,
  quoteDate,
  quoteId,
  quoteInteger,
  quoteMoney,
  quoteRecord,
  quoteText,
} from '../../validators/quotes/quote-response-values';

import type { QuotePriceBasis } from '@admin/clients/model';

export function mapQuoteBasis(value: unknown): QuotePriceBasis {
  const row = quoteRecord(value);
  const selection = mapQuoteSelection(row['intent']);
  const blockers = quoteArray(row['blockers'], 1000).map(quoteText);
  if (selection.kind !== 'oneOffPpe' && row['source'] == null)
    throw new Error('Відсутнє джерело ціни Catalog.');
  if ((selection.kind === 'oneOffPpe') !== (row['taxBasis'] === 'manual_no_extra_vat'))
    throw new Error('Податкова основа не відповідає типу ціни.');
  if (
    row['currency'] !== 'UAH' ||
    !['catalog_no_extra_vat', 'manual_no_extra_vat'].includes(quoteText(row['taxBasis']))
  )
    throw new Error('Невідома валюта або податкова основа КП.');
  if (row['source'] != null) {
    const source = quoteRecord(row['source']);
    if (
      source['kind'] !== selection.kind ||
      selection.kind === 'oneOffPpe' ||
      source['productId'] !== selection.productId ||
      (source['articleId'] ?? null) !== (selection.kind === 'sewing' ? selection.articleId : null)
    )
      throw new Error('Джерело ціни не відповідає вибору.');
    quoteId(source['sourceId']);
    if (!blockers.length && source['sourceId'] === '00000000-0000-0000-0000-000000000000')
      throw new Error('Розрахована ціна не має версії джерела.');
    quoteText(source['formulaVersion']);
    for (const field of ['calculationId', 'ruleVersionId'])
      if (source[field] != null) quoteId(source[field]);
    for (const field of ['compositionVersion', 'settingsVersionId'])
      if (source[field] != null) quoteInteger(source[field]);
    quoteArray(source['referenceVersionIds'], 10000).forEach((id) => quoteInteger(id));
  }
  return {
    token: quoteId(row['basisToken']),
    expiresAt: Date.parse(quoteDate(row['expiresAt'])),
    selection,
    retail: quoteMoney(row['retail']),
    wholesale: quoteMoney(row['wholesale']),
    largeWholesale: quoteMoney(row['largeWholesale']),
    blockers,
    currency: 'UAH',
    taxBasis: row['taxBasis'] as QuotePriceBasis['taxBasis'],
  };
}
