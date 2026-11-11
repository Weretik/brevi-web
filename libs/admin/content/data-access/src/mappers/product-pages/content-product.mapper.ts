import { contentProductTypes, contentTextBlockKinds } from '@admin/content/model';

import {
  amount,
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
  ContentPriceTiers,
  ContentProduct,
  ContentProductPage,
  ContentProductRow,
  ContentProductText,
  ContentProductVisibility,
} from '@admin/content/model';

export function mapContentProductRow(value: unknown): ContentProductRow {
  const row = record(value, 'товар');
  return {
    productId: integer(row['productId'], 'id товару', 1),
    type: oneOf(row['type'], contentProductTypes, 'тип товару'),
    code: nullableText(row['code'], 'код'),
    name: text(row['name'], 'назва'),
    sectionId: nullableInteger(row['sectionId'], 'розділ'),
    sectionName: nullableText(row['sectionName'], 'назва розділу'),
    isActive: flag(row['isActive'], 'активний'),
    mainPhotoUrl: nullableText(row['mainPhotoUrl'], 'фото'),
    hasPrice: flag(row['hasPrice'], 'ціна'),
    hasPage: flag(row['hasPage'], 'сторінка'),
    showOnSite: flag(row['showOnSite'], 'показувати на сайті'),
    onSite: flag(row['onSite'], 'на сайті'),
    slug: nullableText(row['slug'], 'адреса'),
    hasUkrainianText: flag(row['hasUkrainianText'], 'текст українською'),
    hasRussianText: flag(row['hasRussianText'], 'текст російською'),
    hasSeo: flag(row['hasSeo'], 'SEO'),
    updatedAtUtc: nullableDateTime(row['updatedAtUtc'], 'час зміни'),
    categoryCount: integer(row['categoryCount'], 'кількість розділів'),
  };
}

export function mapContentProductPage(value: unknown): ContentProductPage {
  const page = record(value, 'сторінка списку');
  return {
    items: list(page['items'], 'товари').map(mapContentProductRow),
    page: integer(page['page'], 'номер сторінки', 1),
    pageSize: integer(page['pageSize'], 'розмір сторінки', 1),
    total: integer(page['total'], 'кількість'),
  };
}

function mapText(value: unknown): ContentProductText {
  const texts = record(value, 'тексти');
  return {
    name: nullableText(texts['name'], 'назва на сайті'),
    seoTitle: nullableText(texts['seoTitle'], 'SEO-заголовок'),
    seoDescription: nullableText(texts['seoDescription'], 'SEO-опис'),
    summary: list(texts['summary'], 'короткі відомості').map((item) => {
      const fact = record(item, 'рядок відомостей');
      return { label: nullableText(fact['label'], 'назва'), text: text(fact['text'], 'текст') };
    }),
    description: list(texts['description'], 'опис').map((item) => {
      const block = record(item, 'блок опису');
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
    specs: list(texts['specs'], 'характеристики').map((item) => {
      const group = record(item, 'група характеристик');
      return {
        title: nullableText(group['title'], 'назва групи'),
        rows: list(group['rows'], 'рядки групи').map((line) => {
          const row = record(line, 'характеристика');
          return { name: text(row['name'], 'назва'), value: text(row['value'], 'значення') };
        }),
      };
    }),
  };
}

function mapPrices(value: unknown): ContentPriceTiers | null {
  if (value === null || value === undefined) return null;
  const prices = record(value, 'ціни');
  return {
    retail: amount(prices['retail'], 'роздріб'),
    wholesale: amount(prices['wholesale'], 'опт'),
    largeWholesale: amount(prices['largeWholesale'], 'великий опт'),
  };
}

export function mapContentProduct(value: unknown): ContentProduct {
  const product = record(value, 'сторінка товару');
  return {
    product: mapContentProductRow(product['product']),
    revision: integer(product['revision'], 'версія'),
    slug: text(product['slug'], 'адреса'),
    updatedBy: nullableText(product['updatedBy'], 'хто змінив'),
    uk: mapText(product['uk']),
    ru: mapText(product['ru']),
    prices: mapPrices(product['prices']),
    variants: list(product['variants'], 'тканини').map((item) => {
      const variant = record(item, 'тканина');
      return {
        articleId: integer(variant['articleId'], 'id артикула', 1),
        saleSku: text(variant['saleSku'], 'артикул'),
        isActive: flag(variant['isActive'], 'активний'),
        fabricName: nullableText(variant['fabricName'], 'тканина'),
        fabricDetails: nullableText(variant['fabricDetails'], 'опис тканини'),
        prices: mapPrices(variant['prices']),
      };
    }),
    categoryIds: list(product['categoryIds'], 'розділи сайту').map((id) =>
      integer(id, 'id розділу', 1),
    ),
  };
}

export function mapContentProductVisibility(value: unknown): ContentProductVisibility {
  const row = record(value, 'показ на сайті');
  return {
    productId: integer(row['productId'], 'id товару', 1),
    showOnSite: flag(row['showOnSite'], 'показувати на сайті'),
    onSite: flag(row['onSite'], 'на сайті'),
    revision: integer(row['revision'], 'версія'),
    slug: text(row['slug'], 'адреса'),
  };
}
