import type { SewingMaterialKind, SewingMaterialUnit } from '../sewing-composition';
import type { SewingPriceCalculation } from '../sewing-pricing/sewing-price-calculation';
import type { SewingPriceTiers } from '../sewing-pricing/sewing-price-tiers';

/** One fabric variant of a sewing model with its live price, as in the sheet «Прайс на сайт». */
export interface SewingArticleSummaryRow {
  id: number;
  saleSku: string;
  active: boolean;
  sortOrder: number;
  fabricId: number | null;
  /** Current name of the fabric; null when the variant has none or the fabric is unknown. */
  fabricName: string | null;
  /** Current price of one metre of the fabric. */
  fabricPrice: number | null;
  fabricQuantity: number | null;
  calculated: boolean;
  blockers: SewingPriceCalculation['blockers'];
  costs: SewingPriceCalculation['costs'];
  minutes: number | null;
  minuteCost: number | null;
  fullCost: number | null;
  prices: SewingPriceTiers | null;
  published: { publishedAt: string; prices: SewingPriceTiers } | null;
}

/** A shared composition line with the current reference name and unit price (CAT-016). */
export interface SewingCardMaterial {
  id: number;
  kind: SewingMaterialKind;
  referenceId: number | null;
  costCode: string | null;
  name: string | null;
  unitPrice: number | null;
  quantity: number;
  unit: SewingMaterialUnit;
  sortOrder: number;
  comment: string;
}

/** An operation of the model with the norm of the reference «Операції» (CAT-016). */
export interface SewingCardOperation {
  id: number;
  operationId: number;
  name: string | null;
  normMinutes: number | null;
  quantity: number;
  manualMinutes: number | null;
  sortOrder: number;
  comment: string;
}

/**
 * The sewing card in one response (CAT-016): live calculation of every fabric variant (server
 * time, nothing saved) and the shared composition with reference names.
 */
export interface SewingArticleSummary {
  productId: number;
  modelCode: string | null;
  version: number;
  calculatedAt: string;
  articles: SewingArticleSummaryRow[];
  materials: SewingCardMaterial[];
  operations: SewingCardOperation[];
}
