import type { ProductCharacteristicTable, ProductInformationBlock } from './product-content';
import type { ProductType } from '../product-list/product';
import type { ProductPhoto } from '../product-media/product-media';

export interface ProductBaseDraft {
  name: string;
  ruName: string;
  type: ProductType;
  descriptionUk: string;
  descriptionRu: string;
  categoryIds: number[];
  photos: ProductPhoto[];
  informationBlocks?: ProductInformationBlock[];
  characteristicTables?: ProductCharacteristicTable[];
}

export interface SewingProductDraft extends ProductBaseDraft {
  type: 'Sewing';
  metersPerProduct: number;
  fabrics: Array<{ fabricId: number; isPrimary: boolean; sortOrder: number }>;
  accessories: Array<{ garmentAccessoryId: number; quantity: number; sortOrder: number }>;
  operationIds: number[];
}

export type ProductPercentDraft =
  | { source: 'Reference'; additionalReferenceId: number }
  | { source: 'Custom'; customPercent: number };

export interface PpeProductDraft extends ProductBaseDraft {
  type: 'Ppe';
  supplierId: number;
  basePrice: number;
  retailPercent: ProductPercentDraft;
  wholesalePercent: ProductPercentDraft;
}

export type ProductDraft = SewingProductDraft | PpeProductDraft;
