import type { ProductDraft, ProductPercentDraft } from '@admin/products/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

/** The backend takes one body for both kinds: the fields of the other kind go as null. */
export type ProductWriteBody = Omit<Schemas['CreateProductRequest'], 'id'>;

const percent = (value: ProductPercentDraft): Schemas['PercentWriteRequest'] => ({
  source: value.source,
  additionalReferenceId: value.source === 'Reference' ? value.additionalReferenceId : null,
  customPercent: value.source === 'Custom' ? value.customPercent : null,
});

export const toProductWriteBody = (draft: ProductDraft): ProductWriteBody => ({
  type: draft.type,
  name: draft.name,
  ruName: draft.ruName,
  descriptionUk: draft.descriptionUk,
  descriptionRu: draft.descriptionRu,
  categoryIds: draft.categoryIds,
  photos: draft.photos.map((photo) => ({
    mediaFileId: photo.mediaFileId,
    alt: photo.alt ?? null,
    isVisible: photo.isVisible,
    isMain: photo.isMain,
    sortOrder: photo.sortOrder,
  })),
  informationBlocks: draft.informationBlocks ?? null,
  characteristicTables: draft.characteristicTables ?? null,
  metersPerProduct: draft.type === 'Sewing' ? draft.metersPerProduct : null,
  fabrics: draft.type === 'Sewing' ? draft.fabrics : null,
  accessories: draft.type === 'Sewing' ? draft.accessories : null,
  operationIds: draft.type === 'Sewing' ? draft.operationIds : null,
  supplierId: draft.type === 'Ppe' ? draft.supplierId : null,
  basePrice: draft.type === 'Ppe' ? draft.basePrice : null,
  retailPercent: draft.type === 'Ppe' ? percent(draft.retailPercent) : null,
  wholesalePercent: draft.type === 'Ppe' ? percent(draft.wholesalePercent) : null,
});
