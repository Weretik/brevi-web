import type { PpePriceTiers } from '../ppe-pricing/ppe-price-tiers';

export type CatalogProductType = 'Sewing' | 'Ppe';

/** Supplier block of a new PPE product (sheet tab «ЗІЗ»). */
export interface CreatePpeSupplierInput {
  supplierId: number;
  supplierSku: string | null;
  supplierUrl: string;
  supplierPrice: number;
  allowManualPrice: boolean;
  ruleCode: string;
  unit: string;
}

/** A new product from the page «Новий ЗІЗ» or «Нова модель» (CAT-009). */
export interface CreateCatalogProductInput {
  type: CatalogProductType;
  /** Required for PPE; an empty sewing code takes the next free MOD-XXX. */
  code: string | null;
  name: string;
  sectionId: number;
  season: 'Літо' | 'Зима' | null;
  isActive: boolean;
  currentSiteUrl: string | null;
  quoteDescription: string | null;
  ppe: CreatePpeSupplierInput | null;
}

export interface CreatedCatalogProduct {
  id: number;
  type: CatalogProductType;
  code: string | null;
  /** False when the PPE product was saved but its first price was not. */
  priceSaved: boolean;
}

export interface ProductCodeCheck {
  code: string | null;
  /** Null when no code was asked. */
  isAvailable: boolean | null;
  takenByProductId: number | null;
  takenByProductName: string | null;
  /** Next free MOD-XXX for sewing; null for PPE. */
  suggestedCode: string | null;
}

/** Three PPE prices before saving, or blocker codes (MissingRule, InvalidAmount, ...). */
export interface PpePricePreview {
  prices: PpePriceTiers | null;
  blockers: string[];
}
