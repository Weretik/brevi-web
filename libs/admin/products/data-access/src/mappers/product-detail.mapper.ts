import { mapProduct } from './product.mapper';
import { entries, fields, number, record } from '../validators/response-validation';

import type { ProductDetail } from '@admin/products/model';

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

export function mapProductDetail(value: unknown): ProductDetail {
  const detail = record(value);
  mapProduct(detail);
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
  return detail as unknown as ProductDetail;
}
