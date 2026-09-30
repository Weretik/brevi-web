import type { components, operations } from '@admin/api-contract';

export type Product = components['schemas']['ProductListItem'];
export type ProductDetail = components['schemas']['ProductDetail'];
export type ProductCategory = components['schemas']['AdminProductCategoryRow'];
export interface ProductMedia {
  id: number;
  originalFileName: string;
  publicUrl: string;
  contentType: string;
  status: components['schemas']['MediaFileListItem']['status'];
}
export type ProductPage = components['schemas']['PagedResultOfProductListItem'];
export type ProductQuery = NonNullable<operations['getAdminProducts']['parameters']['query']>;
export type ProductBase = components['schemas']['ProductWriteBase'];
export type SewingWrite = components['schemas']['SewingWrite'];
export type PpeWrite = components['schemas']['PpeWrite'];
export type ProductDraft = (ProductBase & SewingWrite) | (ProductBase & PpeWrite);
