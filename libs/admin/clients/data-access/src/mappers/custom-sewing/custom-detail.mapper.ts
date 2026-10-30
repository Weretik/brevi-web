import { mapCustomBasis } from './custom-basis.mapper';
import { mapCustomConfiguration } from './custom-configuration.mapper';
import {
  quoteDate,
  quoteFlag,
  quoteId,
  quoteInteger,
  quoteNullableId,
  quoteRecord,
} from '../../validators/quotes/quote-response-values';

import type { CustomDetail, CustomVersion } from '@admin/clients/model';

export function mapCustomVersion(value: unknown): CustomVersion {
  const row = quoteRecord(value);
  const basis = mapCustomBasis(row['basis']);
  if (!basis.isCalculated) throw new Error('Збережена версія не має розрахунку.');
  quoteInteger(row['actorId']);
  return {
    id: quoteId(row['publicId']),
    number: quoteInteger(row['number']),
    parentId: quoteNullableId(row['parentVersionId']),
    configuration: mapCustomConfiguration(row['configuration']),
    basis,
    createdAt: quoteDate(row['createdAt']),
  };
}
export function mapCustomDetail(value: unknown): CustomDetail {
  const row = quoteRecord(value);
  return {
    id: quoteId(row['publicId']),
    revision: quoteInteger(row['revision']),
    ownerId: quoteInteger(row['ownerId']),
    customerId: quoteNullableId(row['customerPublicId']),
    quoteId: quoteNullableId(row['quotePublicId']),
    configuration: mapCustomConfiguration(row['configuration']),
    currentVersion: row['currentVersion'] == null ? null : mapCustomVersion(row['currentVersion']),
    preview: row['preview'] == null ? null : mapCustomBasis(row['preview']),
    canEdit: quoteFlag(row['canEdit']),
    updatedAt: quoteDate(row['updatedAt']),
  };
}
