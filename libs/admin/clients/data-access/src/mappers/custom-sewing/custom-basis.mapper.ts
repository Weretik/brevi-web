import {
  quoteArray,
  quoteDate,
  quoteFlag,
  quoteId,
  quoteInteger,
  quoteRecord,
  quoteText,
} from '../../validators/quotes/quote-response-values';

import type { CustomPriceBasis } from '@admin/clients/model';

export function mapCustomBasis(value: unknown): CustomPriceBasis {
  const row = quoteRecord(value);
  if (row['formulaVersion'] !== 'custom-sewing-sheet-v1')
    throw new Error('Невідома формула пошиття.');
  const amount = (field: string) => {
    const value = row[field];
    if (value === null) return null;
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0)
      throw new Error('Некоректна серверна сума.');
    if (field !== 'internalCost' && (value >= 1e18 || !/^\d+(?:\.\d{1,2})?$/.test(String(value))))
      throw new Error('Некоректний формат ціни.');
    return value;
  };
  const result: CustomPriceBasis = {
    token: quoteId(row['token']),
    calculatedAt: quoteDate(row['calculatedAt']),
    expiresAt: Date.parse(quoteDate(row['expiresAt'])),
    formulaVersion: row['formulaVersion'],
    internalCost: amount('internalCost'),
    retail: amount('retail'),
    wholesale: amount('wholesale'),
    largeWholesale: amount('largeWholesale'),
    blockers: quoteArray(row['blockers'], 1000).map(quoteText),
    isCalculated: quoteFlag(row['isCalculated']),
  };
  if (result.expiresAt <= Date.parse(result.calculatedAt))
    throw new Error('Некоректний строк розрахунку.');
  if (row['settingsVersionId'] != null) quoteInteger(row['settingsVersionId']);
  quoteArray(row['references'], 240).forEach((value) => {
    const reference = quoteRecord(value);
    quoteText(reference['key']);
    quoteInteger(reference['versionId']);
    quoteText(reference['unit']);
    quoteText(reference['sourceCode']);
    if (
      reference['value'] !== null &&
      (typeof reference['value'] !== 'number' ||
        !Number.isFinite(reference['value']) ||
        reference['value'] < 0)
    )
      throw new Error('Некоректна версія довідника.');
  });
  if (row['breakdown'] != null) {
    const breakdown = quoteRecord(row['breakdown']);
    for (const field of [
      'materials',
      'otherCosts',
      'totalMinutes',
      'minuteCost',
      'seamstress',
      'cutting',
      'master',
      'manager',
      'bonus',
      'overhead',
      'delivery',
      'packaging',
      'applicationCost',
      'applicationSale',
    ])
      if (
        typeof breakdown[field] !== 'number' ||
        !Number.isFinite(breakdown[field]) ||
        breakdown[field] < 0
      )
        throw new Error('Некоректна деталізація розрахунку.');
  }
  const eligible =
    result.blockers.length === 0 &&
    row['breakdown'] != null &&
    result.internalCost !== null &&
    result.internalCost > 0 &&
    row['settingsVersionId'] != null &&
    [result.retail, result.wholesale, result.largeWholesale].every(
      (value) => value !== null && value > 0,
    );
  if (result.isCalculated !== eligible) throw new Error('Неповний серверний розрахунок.');
  return result;
}
