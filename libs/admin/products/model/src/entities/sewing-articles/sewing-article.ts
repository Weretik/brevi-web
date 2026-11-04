/** A fabric variant of a sewing model: its sale SKU and its own fabric (CAT-015). */
export interface SewingArticle {
  id: number;
  productId: number;
  saleSku: string;
  active: boolean;
  sortOrder: number;
  /** The variant's fabric; null when it has none yet. */
  fabricId: number | null;
  /** Metres of the fabric per product. */
  fabricQuantity: number | null;
}
