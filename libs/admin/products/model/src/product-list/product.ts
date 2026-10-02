import type { ProductMainPhoto } from '../product-media/product-media';

export type ProductType = 'Sewing' | 'Ppe';

export interface Product {
  id: number;
  name: string;
  slug: string;
  type: ProductType;
  categoryIds: number[];
  mainPhoto?: ProductMainPhoto | null;
  createdAtUtc: string;
  minimumWholesalePrice: number;
  updatedAtUtc: string | null;
}

export interface ProductPage {
  value: Product[];
  pagedInfo: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
  };
}
