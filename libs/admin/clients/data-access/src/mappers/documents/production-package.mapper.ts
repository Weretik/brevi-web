import {
  quoteDate,
  quoteId,
  quoteInteger,
  quoteRecord,
  quoteText,
} from '../../validators/quotes/quote-response-values';

import type { ProductionPackageView } from '@admin/clients/model';
import type { components } from '@admin/shared/contracts';

export function mapProductionPackage(value: unknown): ProductionPackageView {
  const row = quoteRecord(value);
  const sha256 = quoteText(row['sha256']);
  const length = quoteInteger(row['length']);
  if (
    row['schemaVersion'] !== 1 ||
    row['contentType'] !== 'application/zip' ||
    !/^[0-9a-f]{64}$/i.test(sha256) ||
    length > 64 * 1024 * 1024
  )
    throw new Error('Некоректний виробничий архів.');
  const dto = {
    packageId: quoteId(row['packageId']),
    quoteId: quoteId(row['quoteId']),
    versionId: quoteId(row['versionId']),
    sha256,
    length,
    schemaVersion: 1,
    contentType: 'application/zip',
    createdAt: quoteDate(row['createdAt']),
  } satisfies components['schemas']['CrmProductionPackageDetail'];
  return {
    id: dto.packageId,
    quoteId: dto.quoteId,
    versionId: dto.versionId,
    sha256: dto.sha256,
    bytes: dto.length,
    createdAt: dto.createdAt,
  };
}
