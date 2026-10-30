import {
  quoteArray,
  quoteDate,
  quoteFlag,
  quoteId,
  quoteInteger,
  quoteRecord,
  quoteText,
} from '../../validators/quotes/quote-response-values';

import type { CustomPrivateFile } from '@admin/clients/model';

export function mapCustomFile(value: unknown): CustomPrivateFile {
  const row = quoteRecord(value);
  const contentType = quoteText(row['contentType']);
  const length = quoteInteger(row['length']);
  const sha256 = quoteText(row['sha256']);
  if (
    !['application/pdf', 'image/jpeg', 'image/png'].includes(contentType) ||
    length > 20971520 ||
    !/^[A-F0-9]{64}$/.test(sha256) ||
    row['state'] !== 'Uploaded'
  )
    throw new Error('Некоректні метадані приватного файлу.');
  return {
    id: quoteId(row['publicId']),
    draftId: quoteId(row['draftId']),
    contentType: contentType as CustomPrivateFile['contentType'],
    length,
    sha256,
    state: 'Uploaded',
    expiresAt: quoteDate(row['expiresAt']),
    showInQuote: quoteFlag(row['showInQuote']),
    production: quoteFlag(row['production']),
    isFinalized: quoteFlag(row['isFinalized']),
  };
}

export function mapCustomFiles(value: unknown, draftId: string): CustomPrivateFile[] {
  const rows = quoteArray(value, 30).map(mapCustomFile);
  if (
    rows.some((row) => row.draftId !== draftId || !row.isFinalized) ||
    new Set(rows.map((row) => row.id)).size !== rows.length
  )
    throw new Error('Некоректна вибірка приватних файлів.');
  return rows;
}
