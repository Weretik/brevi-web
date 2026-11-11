import {
  flag,
  integer,
  list,
  nullableDateTime,
  nullableInteger,
  nullableText,
  oneOf,
  record,
  text,
} from '../../validators/content-response';

import type {
  GalleryText,
  SiteGallery,
  SiteGalleryItem,
  SiteGalleryTransfer,
} from '@admin/content/model';

function mapText(value: unknown, name: string): GalleryText {
  const texts = record(value, name);
  return { uk: nullableText(texts['uk'], name) ?? '', ru: nullableText(texts['ru'], name) ?? '' };
}

function mapItem(value: unknown): SiteGalleryItem {
  const item = record(value, 'фото');
  return {
    photoId: nullableInteger(item['photoId'], 'фото'),
    legacyPath: nullableText(item['legacyPath'], 'файл сайту'),
    url: nullableText(item['url'], 'адреса фото'),
    thumbnailUrl: nullableText(item['thumbnailUrl'], 'мала копія'),
    width: nullableInteger(item['width'], 'ширина'),
    height: nullableInteger(item['height'], 'висота'),
    missing: flag(item['missing'], 'фото видалено'),
    title: mapText(item['title'], 'назва'),
    note: mapText(item['note'], 'пояснення'),
    standards: list(item['standards'], 'стандарти').map((x) => text(x, 'стандарт')),
  };
}

export function mapSiteGallery(value: unknown): SiteGallery {
  const gallery = record(value, 'сторінка');
  return {
    kind: oneOf(gallery['key'], ['works', 'certificates'] as const, 'сторінка'),
    items: list(gallery['items'], 'фото').map(mapItem),
    legacyCount: integer(gallery['legacyCount'], 'файли сайту'),
    revision: integer(gallery['revision'], 'версія'),
    updatedAtUtc: nullableDateTime(gallery['updatedAtUtc'], 'час зміни'),
    updatedBy: nullableText(gallery['updatedBy'], 'хто змінив'),
  };
}

export function mapSiteGalleryTransfer(value: unknown): SiteGalleryTransfer {
  const step = record(value, 'перенесення');
  return {
    moved: integer(step['moved'], 'перенесено'),
    left: integer(step['left'], 'лишилось'),
    problems: list(step['problems'], 'проблеми').map((x) => text(x, 'проблема')),
    gallery: mapSiteGallery(step['gallery']),
  };
}
