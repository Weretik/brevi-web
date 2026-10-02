import type { ProductType } from './product';

export interface ProductQuery {
  page?: number;
  pageSize?: 10 | 20 | 50;
  search?: string;
  type?: ProductType;
  categoryId?: number;
  sortBy?: 'id' | 'name' | 'createdAt' | 'updatedAt';
  sortDirection?: 'asc' | 'desc';
}
