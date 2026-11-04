import type { SewingArticle } from '../../entities/sewing-articles/sewing-article';
import type { SewingArticleSummaryRow } from '../../entities/sewing-card/sewing-article-summary';

/** One row of «Тканини»: the variant, its fabric and its live price (CAT-015, CAT-016). */
export interface SewingVariantRow {
  id: number;
  saleSku: string;
  active: boolean;
  sortOrder: number;
  fabricId: number | null;
  /** Fabric name; null when the variant has no fabric or the fabric is not in the reference. */
  fabricName: string | null;
  /** Price of one metre of the fabric. */
  fabricPrice: number | null;
  fabricQuantity: number | null;
  /** The live price of the variant. */
  summary: SewingArticleSummaryRow;
}

/** The card rows in the model's order. */
export function sewingVariantRows(summary: readonly SewingArticleSummaryRow[]): SewingVariantRow[] {
  return [...summary]
    .sort((left, right) => left.sortOrder - right.sortOrder || left.id - right.id)
    .map((row) => ({
      id: row.id,
      saleSku: row.saleSku,
      active: row.active,
      sortOrder: row.sortOrder,
      fabricId: row.fabricId,
      fabricName: row.fabricName,
      fabricPrice: row.fabricPrice,
      fabricQuantity: row.fabricQuantity,
      summary: row,
    }));
}

/** The variants as the «Тканина» panel edits them. */
export function sewingVariantsFromSummary(
  productId: number,
  summary: readonly SewingArticleSummaryRow[],
): SewingArticle[] {
  return summary.map((row) => ({
    id: row.id,
    productId,
    saleSku: row.saleSku,
    active: row.active,
    sortOrder: row.sortOrder,
    fabricId: row.fabricId,
    fabricQuantity: row.fabricQuantity,
  }));
}

/** Label of a variant in other places (the «Розрахунок» switch): its fabric, else its SKU. */
export function sewingVariantLabel(row: Pick<SewingVariantRow, 'fabricName' | 'saleSku'>): string {
  return row.fabricName ?? `Артикул ${row.saleSku}`;
}
