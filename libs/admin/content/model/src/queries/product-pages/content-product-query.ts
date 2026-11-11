import type { ContentProductType } from '../../entities/product-pages/content-product';

export const contentProductSiteFilters = ['all', 'onSite', 'offSite'] as const;
export type ContentProductSiteFilter = (typeof contentProductSiteFilters)[number];

export const contentProductPageSizes = [25, 50, 100] as const;
export const defaultContentProductPageSize = 50;

export interface ContentProductQuery {
  page: number;
  pageSize: number;
  search: string;
  type: ContentProductType | null;
  site: ContentProductSiteFilter;
}
