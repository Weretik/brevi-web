import type {
  ProductCharacteristicTable,
  ProductInformationBlock,
} from '../product-editor/product-content';
import type { Product } from '../product-list/product';
import type { ProductPhoto } from '../product-media/product-media';

export interface SewingProductDetail {
  metersPerProduct: number;
  fabrics: Array<{
    fabricId: number;
    name: string;
    price: number;
    isPrimary: boolean;
    sortOrder: number;
  }>;
  accessories: Array<{
    garmentAccessoryId: number;
    name: string;
    price: number;
    quantity: number;
    sortOrder: number;
  }>;
  operations: Array<{ id: number; name: string; minutes: number }>;
  piecesPerShift: number | null;
  prices: {
    byFabric: Array<{
      fabricId: number;
      price1To10: number;
      price11To39: number;
      price40Plus: number;
    }>;
    ranges: Record<
      string,
      { minPrice: number; minFabricId: number; maxPrice: number; maxFabricId: number }
    >;
  } | null;
}

export type ProductPercentDetail =
  | {
      source: 'Reference';
      reference: { id: number; name: string; key: string; value: number; unit: string };
    }
  | { source: 'Custom'; customPercent: number };

export interface PpeProductDetail {
  supplier: { id: number; name: string };
  basePrice: number;
  retailPercent: ProductPercentDetail;
  wholesalePercent: ProductPercentDetail;
  retailPrice: number;
  wholesalePrice: number;
}

export interface ProductDetail extends Product {
  ruName: string;
  categories: Array<{ id: number; name: string; ruName: string; slug: string }>;
  descriptionUk: string;
  descriptionRu: string;
  photos: Array<ProductPhoto & { url: string }>;
  informationBlocks: ProductInformationBlock[];
  characteristicTables: ProductCharacteristicTable[];
  sewing?: SewingProductDetail | null;
  ppe?: PpeProductDetail | null;
}
