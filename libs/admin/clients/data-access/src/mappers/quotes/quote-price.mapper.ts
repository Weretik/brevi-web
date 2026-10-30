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
import { mapCustomBasis } from '../custom-sewing/custom-basis.mapper';
import { mapCustomConfiguration } from '../custom-sewing/custom-configuration.mapper';

import type { QuotePriceBasis, QuotePriceSource } from '@admin/clients/model';

export function mapQuoteBasis(value: unknown): QuotePriceBasis {
  const row = quoteRecord(value);
  let selection = mapQuoteSelection(row['intent']);
  if (selection.kind === 'customSewing') {
    const snapshot = quoteRecord(row['customVersion']);
    if (quoteId(snapshot['versionPublicId']) !== selection.versionId)
      throw new Error('Версія пошиття не відповідає вибору.');
    const basis = quoteRecord(snapshot['basis']);
    for (const tier of ['retail', 'wholesale', 'largeWholesale'])
      if (row[tier] !== basis[tier]) throw new Error('Ціна пошиття не відповідає версії.');
    quoteInteger(snapshot['number']);
    mapCustomConfiguration(snapshot['configuration']);
    if (
      !mapCustomBasis(snapshot['basis']).isCalculated ||
      row['taxBasis'] !== 'custom_no_extra_vat' ||
      row['source'] != null
    )
      throw new Error('Некоректна основа ціни пошиття.');
    selection = { ...selection, draftId: quoteId(snapshot['draftPublicId']) };
  }
  const blockers = quoteArray(row['blockers'], 1000).map(quoteText);
  if (selection.kind !== 'oneOffPpe' && selection.kind !== 'customSewing' && row['source'] == null)
    throw new Error('Відсутнє джерело ціни Catalog.');
  const expectedTax =
    selection.kind === 'oneOffPpe'
      ? 'manual_no_extra_vat'
      : selection.kind === 'customSewing'
        ? 'custom_no_extra_vat'
        : 'catalog_no_extra_vat';
  if (row['taxBasis'] !== expectedTax) throw new Error('Податкова основа не відповідає типу ціни.');
  if (
    row['currency'] !== 'UAH' ||
    !['catalog_no_extra_vat', 'manual_no_extra_vat', 'custom_no_extra_vat'].includes(
      quoteText(row['taxBasis']),
    )
  )
    throw new Error('Невідома валюта або податкова основа КП.');
  let provenance: QuotePriceSource | null = null;
  if (row['source'] != null) {
    const source = quoteRecord(row['source']);
    if (
      source['kind'] !== selection.kind ||
      selection.kind === 'oneOffPpe' ||
      selection.kind === 'customSewing' ||
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
    provenance = {
      sourceId: quoteId(source['sourceId']),
      formulaVersion: quoteText(source['formulaVersion']),
      calculationId: source['calculationId'] == null ? null : quoteId(source['calculationId']),
      ruleVersionId: source['ruleVersionId'] == null ? null : quoteId(source['ruleVersionId']),
      compositionVersion:
        source['compositionVersion'] == null ? null : quoteInteger(source['compositionVersion']),
      settingsVersionId:
        source['settingsVersionId'] == null ? null : quoteInteger(source['settingsVersionId']),
      referenceVersionIds: quoteArray(source['referenceVersionIds'], 10000).map((id) =>
        quoteInteger(id),
      ),
    };
  }
  return {
    token: quoteId(row['basisToken']),
    source: provenance,
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
