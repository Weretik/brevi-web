import { customConfigurationErrors } from '@admin/clients/model';

import {
  quoteArray,
  quoteFlag,
  quoteId,
  quoteInteger,
  quoteRecord,
  quoteText,
} from '../../validators/quotes/quote-response-values';

import type { CustomConfiguration } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

type Configuration =
  operations['createCrmCustomSewingDraft']['requestBody']['content']['application/json']['configuration'];

function number(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value))
    throw new Error('Некоректна норма пошиття.');
  return value;
}
export function mapCustomConfiguration(value: unknown): CustomConfiguration {
  const row = quoteRecord(value);
  if (row['season'] !== 'summer' && row['season'] !== 'winter') throw new Error('Невідомий сезон.');
  const materials = (field: 'fabrics' | 'accessories') =>
    quoteArray(row[field], field === 'fabrics' ? 40 : 100).map((entry) => {
      const item = quoteRecord(entry);
      return {
        referenceId: quoteInteger(item['referenceId']),
        quantity: number(item['quantity']),
        unit: quoteText(item['unit']),
      };
    });
  const configuration: CustomConfiguration = {
    name: quoteText(row['name']),
    productType: quoteText(row['productType']),
    season: row['season'],
    description: quoteText(row['description']),
    clientComment: quoteText(row['clientComment']),
    internalNote: quoteText(row['internalNote']),
    fabrics: materials('fabrics'),
    accessories: materials('accessories'),
    operations: quoteArray(row['operations'], 100).map((entry) => {
      const item = quoteRecord(entry);
      return {
        referenceId: quoteInteger(item['referenceId']),
        quantity: number(item['quantity']),
        manualMinutes: item['manualMinutes'] == null ? null : number(item['manualMinutes']),
      };
    }),
    applications: quoteArray(row['applications'], 20).map((entry) => {
      const item = quoteRecord(entry);
      if (item['kind'] !== 'embroidery' && item['kind'] !== 'print')
        throw new Error('Невідомий тип нанесення.');
      return {
        kind: item['kind'],
        location: quoteText(item['location']),
        artworkFileId: item['artworkFileId'] == null ? null : quoteId(item['artworkFileId']),
        cost: number(item['cost']),
        saleAmount: number(item['saleAmount']),
        saleApproved: quoteFlag(item['saleApproved']),
      };
    }),
    delivery: number(row['delivery']),
    packaging: number(row['packaging']),
  };
  if (Object.keys(customConfigurationErrors(configuration)).length)
    throw new Error('Некоректна конфігурація пошиття.');
  return configuration;
}

export function customConfigurationPayload(value: CustomConfiguration): Configuration {
  return {
    name: value.name,
    productType: value.productType,
    season: value.season,
    description: value.description,
    clientComment: value.clientComment,
    internalNote: value.internalNote,
    delivery: value.delivery,
    packaging: value.packaging,
    fabrics: value.fabrics.map(({ referenceId, quantity, unit }) => ({
      referenceId,
      quantity,
      unit,
    })),
    accessories: value.accessories.map(({ referenceId, quantity, unit }) => ({
      referenceId,
      quantity,
      unit,
    })),
    operations: value.operations.map(({ referenceId, quantity, manualMinutes }) => ({
      referenceId,
      quantity,
      manualMinutes,
    })),
    applications: value.applications.map(
      ({ kind, location, artworkFileId, cost, saleAmount, saleApproved }) => ({
        kind,
        location,
        artworkFileId,
        cost,
        saleAmount,
        saleApproved,
      }),
    ),
  };
}
