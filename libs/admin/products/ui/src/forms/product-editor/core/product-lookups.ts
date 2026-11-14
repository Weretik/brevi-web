import type { ProductCategory, ProductMedia } from '@admin/products/model';
import type {
  Fabric,
  GarmentAccessory,
  GarmentPartOperation,
  PricingParameter,
  Supplier,
} from '@admin/references/model';

export interface ProductLookups {
  categories: ProductCategory[];
  media: ProductMedia[];
  fabrics: Fabric[];
  accessories: GarmentAccessory[];
  operations: GarmentPartOperation[];
  suppliers: Supplier[];
  /** Pricing parameters; a PPE percent can point at one with the «%» unit. */
  references: PricingParameter[];
}
