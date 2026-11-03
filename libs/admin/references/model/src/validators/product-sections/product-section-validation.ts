import type { ProductSectionType } from '../../entities/product-sections/product-section';

export interface ProductSectionFormValues {
  type: ProductSectionType;
  name: string;
  isActive: boolean;
  comment: string;
}

export type ProductSectionField = keyof ProductSectionFormValues;
export type ProductSectionFieldErrors = Partial<Record<ProductSectionField, string>>;

/** Text limits shared with BreviERP `ProductSection`. */
export const productSectionTextLimits = { name: 200, comment: 1000 } as const;

export function validateProductSection(
  values: ProductSectionFormValues,
): ProductSectionFieldErrors {
  const errors: ProductSectionFieldErrors = {};
  const name = values.name.trim();
  if (!name) errors.name = 'Вкажіть назву розділу.';
  else if (name.length > productSectionTextLimits.name)
    errors.name = `Не більше ${productSectionTextLimits.name} символів.`;
  if (values.comment.trim().length > productSectionTextLimits.comment)
    errors.comment = `Не більше ${productSectionTextLimits.comment} символів.`;
  return errors;
}
