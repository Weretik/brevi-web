import type { ProductCategory, ProductMedia } from '@admin/products/model';
import type {
  AdditionalReference,
  Fabric,
  GarmentAccessory,
  GarmentPartOperation,
  Supplier,
} from '@admin/references/model';

export interface ProductLookups {
  categories: ProductCategory[];
  media: ProductMedia[];
  fabrics: Fabric[];
  accessories: GarmentAccessory[];
  operations: GarmentPartOperation[];
  suppliers: Supplier[];
  references: AdditionalReference[];
}
