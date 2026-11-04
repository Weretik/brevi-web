import type { SewingArticle } from '../../entities/sewing-articles/sewing-article';
import type { SewingArticleSummaryRow } from '../../entities/sewing-card/sewing-article-summary';

interface FabricLookup {
  id: number;
  name: string;
  price: number;
}

/** One row of «Тканини»: the variant, its fabric and its live price (CAT-015). */
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
  /** The live price of the variant; null until the summary has answered. */
  summary: SewingArticleSummaryRow | null;
}

/** Joins the variants with their fabric names and live prices, in the model's order. */
export function sewingVariantRows(
  variants: readonly SewingArticle[],
  summary: readonly SewingArticleSummaryRow[],
  fabrics: readonly FabricLookup[],
): SewingVariantRow[] {
  return [...variants]
    .sort((left, right) => left.sortOrder - right.sortOrder || left.id - right.id)
    .map((variant) => {
      const fabric = fabrics.find((item) => item.id === variant.fabricId);
      return {
        id: variant.id,
        saleSku: variant.saleSku,
        active: variant.active,
        sortOrder: variant.sortOrder,
        fabricId: variant.fabricId,
        fabricName: fabric?.name ?? null,
        fabricPrice: fabric?.price ?? null,
        fabricQuantity: variant.fabricQuantity,
        summary: summary.find((row) => row.id === variant.id) ?? null,
      };
    });
}

/** Label of a variant in other places (the «Розрахунок» switch): its fabric, else its SKU. */
export function sewingVariantLabel(row: Pick<SewingVariantRow, 'fabricName' | 'saleSku'>): string {
  return row.fabricName ?? `Артикул ${row.saleSku}`;
}
