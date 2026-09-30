import { number, record } from './response-validation';

import type { Product, ProductCategory, ProductDetail, ProductPage } from './products.model';

function fields(value: unknown, stringFields: string[], numberFields: string[] = []): boolean {
  const item = record(value);
  return (
    stringFields.every((field) => typeof item[field] === 'string') &&
    numberFields.every((field) => number(item[field]))
  );
}

function entries(value: unknown, check: (item: unknown) => boolean): boolean {
  return Array.isArray(value) && value.every(check);
}

function percent(value: unknown): boolean {
  const item = record(value);
  return item['source'] === 'Reference'
    ? fields(item['reference'], ['name', 'key', 'unit'], ['id', 'value'])
    : item['source'] === 'Custom' && number(item['customPercent']);
}

function sewingPrices(value: unknown): boolean {
  if (value === null) return true;
  const prices = record(value);
  if (
    !entries(prices['byFabric'], (item) =>
      fields(item, [], ['fabricId', 'price1To10', 'price11To39', 'price40Plus']),
    )
  )
    return false;
  const ranges = record(prices['ranges']);
  return ['price1To10', 'price11To39', 'price40Plus'].every((key) =>
    fields(ranges[key], [], ['minPrice', 'minFabricId', 'maxPrice', 'maxFabricId']),
  );
}

function product(value: unknown): Product {
  const row = record(value);
  if (
    !number(row['id']) ||
    !Number.isInteger(row['id']) ||
    typeof row['name'] !== 'string' ||
    typeof row['slug'] !== 'string' ||
    (row['type'] !== 'Sewing' && row['type'] !== 'Ppe') ||
    !entries(row['categoryIds'], number) ||
    !number(row['minimumWholesalePrice']) ||
    typeof row['createdAtUtc'] !== 'string' ||
    !(row['updatedAtUtc'] === null || typeof row['updatedAtUtc'] === 'string')
  ) {
    throw new Error('Некоректна відповідь товарів.');
  }
  if (row['mainPhoto'] != null) {
    const photo = record(row['mainPhoto']);
    if (!number(photo['mediaFileId']) || typeof photo['url'] !== 'string') {
      throw new Error('Некоректне фото товару.');
    }
  }
  return row as Product;
}

export function mapProductPage(value: unknown): ProductPage {
  const payload = record(value);
  const info = record(payload['pagedInfo']);
  if (
    !Array.isArray(payload['value']) ||
    !['pageNumber', 'pageSize', 'totalPages', 'totalRecords'].every(
      (field) =>
        number(info[field]) && Number.isInteger(info[field]) && (info[field] as number) >= 0,
    )
  ) {
    throw new Error('Некоректна сторінка товарів.');
  }
  return { value: payload['value'].map(product), pagedInfo: info as ProductPage['pagedInfo'] };
}

export function mapProductDetail(value: unknown): ProductDetail {
  const detail = record(value);
  product(detail);
  if (
    typeof detail['ruName'] !== 'string' ||
    typeof detail['descriptionUk'] !== 'string' ||
    typeof detail['descriptionRu'] !== 'string' ||
    !entries(detail['categories'], (item) => fields(item, ['name', 'ruName', 'slug'], ['id'])) ||
    !entries(detail['photos'], (item) => {
      const photo = record(item);
      return (
        fields(photo, ['url'], ['mediaFileId', 'sortOrder']) &&
        (photo['alt'] == null || typeof photo['alt'] === 'string') &&
        typeof photo['isVisible'] === 'boolean' &&
        typeof photo['isMain'] === 'boolean'
      );
    }) ||
    !entries(detail['informationBlocks'], (item) =>
      fields(item, ['titleUk', 'titleRu', 'textUk', 'textRu'], ['sortOrder']),
    ) ||
    !entries(detail['characteristicTables'], (item) => {
      const table = record(item);
      return (
        fields(table, ['titleUk', 'titleRu'], ['sortOrder']) &&
        entries(table['rows'], (row) =>
          fields(row, ['labelUk', 'labelRu', 'valueUk', 'valueRu'], ['sortOrder']),
        )
      );
    })
  ) {
    throw new Error('Некоректні деталі товару.');
  }
  if (detail['type'] === 'Sewing') {
    const sewing = record(detail['sewing']);
    if (
      !number(sewing['metersPerProduct']) ||
      !(sewing['piecesPerShift'] === null || number(sewing['piecesPerShift'])) ||
      !sewingPrices(sewing['prices']) ||
      !entries(sewing['fabrics'], (item) => {
        const fabric = record(item);
        return (
          fields(fabric, ['name'], ['fabricId', 'price', 'sortOrder']) &&
          typeof fabric['isPrimary'] === 'boolean'
        );
      }) ||
      !entries(sewing['accessories'], (item) =>
        fields(item, ['name'], ['garmentAccessoryId', 'price', 'quantity', 'sortOrder']),
      ) ||
      !entries(sewing['operations'], (item) => fields(item, ['name'], ['id', 'minutes']))
    ) {
      throw new Error('Некоректні дані швейного товару.');
    }
  } else {
    const ppe = record(detail['ppe']);
    if (
      !fields(ppe['supplier'], ['name'], ['id']) ||
      !number(ppe['basePrice']) ||
      !number(ppe['retailPrice']) ||
      !number(ppe['wholesalePrice']) ||
      !percent(ppe['retailPercent']) ||
      !percent(ppe['wholesalePercent'])
    ) {
      throw new Error('Некоректні дані ЗІЗ.');
    }
  }
  return detail as ProductDetail;
}

export function mapProductCategories(value: unknown): ProductCategory[] {
  if (!Array.isArray(value)) throw new Error('Некоректний список категорій.');
  return value.map((item) => {
    const row = record(item);
    if (
      !number(row['id']) ||
      typeof row['name'] !== 'string' ||
      typeof row['isActive'] !== 'boolean'
    ) {
      throw new Error('Некоректна категорія товару.');
    }
    return row as ProductCategory;
  });
}
