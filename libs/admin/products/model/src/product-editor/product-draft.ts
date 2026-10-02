import { ordered } from '../ordering/product-order';
import { groupPrimaryFabrics } from '../sewing/product-fabrics';

import type { ProductDraft } from './product-draft.types';
import type { ProductDetail } from '../product-detail/product-detail';

export function emptyProductDraft(type: ProductDraft['type'] = 'Sewing'): ProductDraft {
  const base = {
    name: '',
    ruName: '',
    descriptionUk: '',
    descriptionRu: '',
    categoryIds: [],
    photos: [],
    informationBlocks: [],
    characteristicTables: [],
  };
  return type === 'Sewing'
    ? { ...base, type, metersPerProduct: 0, fabrics: [], accessories: [], operationIds: [] }
    : {
        ...base,
        type,
        supplierId: 0,
        basePrice: 0,
        retailPercent: { source: 'Custom', customPercent: 0 },
        wholesalePercent: { source: 'Custom', customPercent: 0 },
      };
}

export function changeProductType(draft: ProductDraft, type: ProductDraft['type']): ProductDraft {
  if (draft.type === type) return draft;
  const shared = {
    name: draft.name,
    ruName: draft.ruName,
    descriptionUk: draft.descriptionUk,
    descriptionRu: draft.descriptionRu,
    categoryIds: draft.categoryIds,
    photos: draft.photos,
    informationBlocks: draft.informationBlocks,
    characteristicTables: draft.characteristicTables,
  };
  return { ...emptyProductDraft(type), ...shared } as ProductDraft;
}

export function draftFromDetail(detail: ProductDetail): ProductDraft {
  const base = {
    name: detail.name,
    ruName: detail.ruName,
    descriptionUk: detail.descriptionUk,
    descriptionRu: detail.descriptionRu,
    categoryIds: [...detail.categoryIds],
    photos: ordered(detail.photos).map(({ mediaFileId, alt, isVisible, isMain, sortOrder }) => ({
      mediaFileId,
      alt,
      isVisible,
      isMain,
      sortOrder,
    })),
    informationBlocks: ordered(detail.informationBlocks).map((item) => ({ ...item })),
    characteristicTables: ordered(detail.characteristicTables).map((table) => ({
      ...table,
      rows: ordered(table.rows).map((row) => ({ ...row })),
    })),
  };
  if (detail.type === 'Sewing' && detail.sewing) {
    return {
      ...base,
      type: 'Sewing',
      metersPerProduct: detail.sewing.metersPerProduct,
      fabrics: groupPrimaryFabrics([
        ...ordered(detail.sewing.fabrics).filter((item) => item.isPrimary),
        ...ordered(detail.sewing.fabrics).filter((item) => !item.isPrimary),
      ]).map(({ fabricId, isPrimary, sortOrder }) => ({ fabricId, isPrimary, sortOrder })),
      accessories: ordered(detail.sewing.accessories).map(
        ({ garmentAccessoryId, quantity, sortOrder }) => ({
          garmentAccessoryId,
          quantity,
          sortOrder,
        }),
      ),
      operationIds: detail.sewing.operations.map((item) => item.id),
    };
  }
  if (detail.type === 'Ppe' && detail.ppe) {
    const percent = (value: NonNullable<ProductDetail['ppe']>['retailPercent']) =>
      value.source === 'Reference'
        ? { source: 'Reference' as const, additionalReferenceId: value.reference.id }
        : { source: 'Custom' as const, customPercent: value.customPercent };
    return {
      ...base,
      type: 'Ppe',
      supplierId: detail.ppe.supplier.id,
      basePrice: detail.ppe.basePrice,
      retailPercent: percent(detail.ppe.retailPercent),
      wholesalePercent: percent(detail.ppe.wholesalePercent),
    };
  }
  throw new Error('Неповні дані товару для редагування.');
}
