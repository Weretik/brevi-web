import { entries, number, record } from '../response-validation';

import type {
  OldSitePhotoImportReportResponse,
  ProductPhotoListResponse,
} from '../../contracts/product-photos/product-photos.dto';

const isText = (value: unknown) => value === null || typeof value === 'string';
const isCount = (value: unknown) => Number.isInteger(value) && (value as number) >= 0;
const statuses = ['Found', 'Create', 'Created', 'NotFound'];

function validPhoto(value: unknown): boolean {
  const row = record(value);
  return (
    number(row['mediaFileId']) &&
    isText(row['fileName']) &&
    isText(row['url']) &&
    isText(row['thumbnailUrl']) &&
    typeof row['isMain'] === 'boolean' &&
    number(row['sortOrder']) &&
    typeof row['missing'] === 'boolean'
  );
}

export function parseProductPhotoList(value: unknown): ProductPhotoListResponse {
  const list = record(value);
  if (!number(list['productId']) || !entries(list['photos'], validPhoto))
    throw new Error('Некоректна відповідь фото товару.');
  return value as ProductPhotoListResponse;
}

function validLine(value: unknown): boolean {
  const line = record(value);
  return (
    number(line['oldId']) &&
    typeof line['oldName'] === 'string' &&
    statuses.includes(line['status'] as string) &&
    (line['productId'] === null || number(line['productId'])) &&
    isText(line['productName']) &&
    isCount(line['photosToAdd']) &&
    isCount(line['photosAdded']) &&
    entries(line['errors'], (item) => typeof item === 'string')
  );
}

export function parseOldSitePhotoImportReport(value: unknown): OldSitePhotoImportReportResponse {
  const report = record(value);
  const counts = [
    'products',
    'found',
    'modelsToCreate',
    'modelsCreated',
    'notFound',
    'filesToDownload',
    'filesDownloaded',
    'photosAdded',
  ];
  if (
    typeof report['dryRun'] !== 'boolean' ||
    !counts.every((key) => isCount(report[key])) ||
    !entries(report['lines'], validLine)
  )
    throw new Error('Некоректний звіт імпорту фото.');
  return value as OldSitePhotoImportReportResponse;
}
