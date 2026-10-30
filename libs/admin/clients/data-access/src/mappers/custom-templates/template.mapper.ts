import { templateSelections } from '@admin/clients/model';

import {
  quoteArray,
  quoteDate,
  quoteFlag,
  quoteId,
  quoteInteger,
  quoteRecord,
  quoteText,
} from '../../validators/quotes/quote-response-values';
import { mapCustomConfiguration } from '../custom-sewing/custom-configuration.mapper';

import type {
  CustomTemplateDetail,
  CustomTemplatePage,
  CustomTemplateSelections,
  CustomTemplateSummary,
} from '@admin/clients/model';

function text(value: unknown, maximum: number): string {
  const result = quoteText(value);
  if (result.length > maximum) throw new Error('Завеликий текст шаблону.');
  return result;
}
export function mapTemplateSelections(value: unknown): CustomTemplateSelections {
  const row = quoteRecord(value);
  return templateSelections(
    mapCustomConfiguration({
      ...row,
      internalNote: '',
      delivery: 0,
      packaging: 0,
      applications: quoteArray(row['applications'], 20).map((value) => {
        const app = quoteRecord(value);
        return {
          kind: app['kind'],
          location: app['location'],
          artworkFileId: null,
          cost: 0,
          saleAmount: 0,
          saleApproved: false,
        };
      }),
    }),
  );
}
function summary(value: unknown): CustomTemplateSummary {
  const row = quoteRecord(value);
  if (
    row['kind'] !== 'customConfiguration' ||
    (row['season'] !== 'summer' && row['season'] !== 'winter')
  )
    throw new Error('Невідомий тип шаблону.');
  return {
    id: quoteId(row['publicId']),
    ownerId: quoteInteger(row['ownerId']),
    revision: quoteInteger(row['revision']),
    archived: quoteFlag(row['archived']),
    versionNumber: quoteInteger(row['versionNumber']),
    name: text(row['name'], 300),
    productType: text(row['productType'], 100),
    season: row['season'],
    updatedAt: quoteDate(row['updatedAt']),
  };
}
export function mapTemplateDetail(value: unknown): CustomTemplateDetail {
  const row = quoteRecord(value);
  const selections = mapTemplateSelections(row['selections']);
  return {
    ...summary({
      ...row,
      name: selections.name,
      productType: selections.productType,
      season: selections.season,
    }),
    versionId: quoteId(row['versionId']),
    introduction: text(row['introduction'], 4000),
    selections,
    canEdit: quoteFlag(row['canEdit']),
  };
}
export function mapTemplatePage(value: unknown): CustomTemplatePage {
  const row = quoteRecord(value);
  const page = quoteRecord(row['pagedInfo']);
  return {
    rows: quoteArray(row['value'], 25).map(summary),
    page: quoteInteger(page['pageNumber']),
    totalPages: quoteInteger(page['totalPages'], 0),
  };
}
