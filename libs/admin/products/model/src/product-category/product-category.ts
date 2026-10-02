export interface ProductCategory {
  id: number;
  name: string;
  ruName: string;
  slug: string;
  parentId?: number | null;
  path: string;
  level: number;
  sortOrder: number;
  isActive: boolean;
  description?: string | null;
}
