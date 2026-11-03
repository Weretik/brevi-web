/** «Тип товару» of the Calculator sheet «Типи і розділи». */
export type ProductSectionType = 'Sewing' | 'Ppe';

export const productSectionTypes: readonly ProductSectionType[] = ['Sewing', 'Ppe'];

export const productSectionTypeLabels: Record<ProductSectionType, string> = {
  Sewing: 'Швейна продукція',
  Ppe: 'ЗІЗ',
};

/** A product section («Розділ»): «Одяг ЛІТО», «Захист рук»…; the public site builds categories from it. */
export interface ProductSection {
  id: number;
  type: ProductSectionType;
  name: string;
  isActive: boolean;
  comment: string | null;
  sortOrder: number;
}
