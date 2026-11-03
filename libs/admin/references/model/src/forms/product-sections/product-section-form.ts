import type {
  ProductSection,
  ProductSectionType,
} from '../../entities/product-sections/product-section';
import type { ProductSectionFormValues } from '../../validators/product-sections/product-section-validation';

export function createProductSectionFormValues(
  section: ProductSection | null,
  type: ProductSectionType = 'Sewing',
): ProductSectionFormValues {
  return {
    type: section?.type ?? type,
    name: section?.name ?? '',
    isActive: section?.isActive ?? true,
    comment: section?.comment ?? '',
  };
}

/** Request fields of a create or update. */
export function productSectionBody(values: ProductSectionFormValues, sortOrder: number) {
  return {
    type: values.type,
    name: values.name.trim(),
    isActive: values.isActive,
    comment: values.comment.trim() || null,
    sortOrder,
  };
}
