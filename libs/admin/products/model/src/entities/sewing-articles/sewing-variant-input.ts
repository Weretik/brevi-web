/** What creating or changing a fabric variant sends (CAT-015). */
export interface SewingVariantInput {
  saleSku: string;
  active: boolean;
  sortOrder: number;
  fabricId: number;
  fabricQuantity: number;
  expectedVersion: number;
}
