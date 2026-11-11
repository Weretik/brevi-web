import { contentTextBlockKinds } from '@admin/content/model';

import {
  dateTime,
  flag,
  integer,
  list,
  nullableInteger,
  nullableText,
  oneOf,
  record,
  text,
} from '../../validators/content-response';

import type {
  SiteCategory,
  SiteCategoryRow,
  SiteCategoryText,
  SiteCategoryVisibility,
} from '@admin/content/model';

export function mapSiteCategoryRow(value: unknown): SiteCategoryRow {
  const row = record(value, 'розділ сайту');
  return {
    id: integer(row['id'], 'id розділу', 1),
    parentId: nullableInteger(row['parentId'], 'батьківський розділ'),
    slug: text(row['slug'], 'адреса'),
    sortOrder: integer(row['sortOrder'], 'порядок'),
    showOnSite: flag(row['showOnSite'], 'показувати на сайті'),
    onSite: flag(row['onSite'], 'на сайті'),
    nameUk: nullableText(row['nameUk'], 'назва українською'),
    nameRu: nullableText(row['nameRu'], 'назва російською'),
    hasUkrainianText: flag(row['hasUkrainianText'], 'текст українською'),
    hasRussianText: flag(row['hasRussianText'], 'текст російською'),
    hasSeo: flag(row['hasSeo'], 'SEO'),
    productCount: integer(row['productCount'], 'кількість товарів'),
    updatedAtUtc: dateTime(row['updatedAtUtc'], 'час зміни'),
  };
}

export function mapSiteCategoryList(value: unknown): SiteCategoryRow[] {
  return list(record(value, 'розділи сайту')['items'], 'розділи').map(mapSiteCategoryRow);
}

function mapText(value: unknown): SiteCategoryText {
  const texts = record(value, 'тексти розділу');
  return {
    name: nullableText(texts['name'], 'назва'),
    seoTitle: nullableText(texts['seoTitle'], 'SEO-заголовок'),
    seoDescription: nullableText(texts['seoDescription'], 'SEO-опис'),
    text: list(texts['text'], 'текст').map((item) => {
      const block = record(item, 'блок тексту');
      return {
        kind: oneOf(block['kind'], contentTextBlockKinds, 'тип блоку'),
        text: nullableText(block['text'], 'текст блоку'),
        lead: nullableText(block['lead'], 'початок абзацу'),
        items:
          block['items'] == null
            ? []
            : list(block['items'], 'рядки списку').map((line) => text(line)),
      };
    }),
  };
}

export function mapSiteCategory(value: unknown): SiteCategory {
  const category = record(value, 'розділ сайту');
  return {
    category: mapSiteCategoryRow(category['category']),
    revision: integer(category['revision'], 'версія'),
    updatedBy: nullableText(category['updatedBy'], 'хто змінив'),
    uk: mapText(category['uk']),
    ru: mapText(category['ru']),
  };
}

export function mapSiteCategoryVisibility(value: unknown): SiteCategoryVisibility {
  const row = record(value, 'показ розділу');
  return {
    id: integer(row['id'], 'id розділу', 1),
    showOnSite: flag(row['showOnSite'], 'показувати на сайті'),
    onSite: flag(row['onSite'], 'на сайті'),
    revision: integer(row['revision'], 'версія'),
  };
}
