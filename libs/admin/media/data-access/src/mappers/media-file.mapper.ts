import {
  dateTime,
  integer,
  list,
  nonEmptyText,
  nullableInteger,
  nullableText,
  record,
} from '../validators/media-response';

import type { MediaFile, MediaFileDetail, MediaFilePage } from '@admin/media/model';

export function mapMediaFile(value: unknown): MediaFile {
  const row = record(value, 'фото');
  return {
    id: integer(row['id'], 'id фото', 1),
    fileName: nonEmptyText(row['fileName'], 'назва фото'),
    alt: nullableText(row['alt'], 'опис фото'),
    folderId: nullableInteger(row['folderId'], 'папка фото', 1),
    publicUrl: nonEmptyText(row['publicUrl'], 'адреса фото'),
    contentType: nonEmptyText(row['contentType'], 'тип фото'),
    sizeInBytes: integer(row['sizeInBytes'], 'розмір фото'),
    width: nullableInteger(row['width'], 'ширина фото', 1),
    height: nullableInteger(row['height'], 'висота фото', 1),
    createdAt: dateTime(row['createdAt'], 'дата фото'),
  };
}

export function mapMediaFilePage(value: unknown): MediaFilePage {
  const page = record(value, 'сторінка фото');
  return {
    items: list(page['items'], 'список фото').map(mapMediaFile),
    total: integer(page['total'], 'кількість фото'),
    page: integer(page['page'], 'номер сторінки', 1),
    pageSize: integer(page['pageSize'], 'розмір сторінки', 1),
  };
}

export function mapMediaFileDetail(value: unknown): MediaFileDetail {
  const detail = record(value, 'фото');
  return {
    file: mapMediaFile(detail['file']),
    usages: list(detail['usages'], 'використання фото').map((item) => {
      const usage = record(item, 'використання фото');
      return {
        area: nonEmptyText(usage['area'], 'розділ'),
        ownerId: integer(usage['ownerId'], 'власник', 1),
        title: text(usage['title'], 'назва власника'),
      };
    }),
  };
}

function text(value: unknown, what: string): string {
  return nullableText(value, what) ?? '';
}
