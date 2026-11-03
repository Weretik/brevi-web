/** The two tables of the «Товари» page: sheet tabs «Товари» (sewing models) and «ЗІЗ». */
export type ProductOverviewType = 'Sewing' | 'Ppe';

export const productOverviewTypeLabels: Record<ProductOverviewType, string> = {
  Sewing: 'Швейна продукція',
  Ppe: 'ЗІЗ',
};

/** «Сезон» of a sewing model, as in the sheet. */
export type ProductSeason = 'Літо' | 'Зима';

export const productSeasons: readonly ProductSeason[] = ['Літо', 'Зима'];

/** One row of the «Товари» page: the product's working fields without site texts or photos. */
export interface ProductOverview {
  id: number;
  type: ProductOverviewType;
  /** Model ID (MOD-…) for sewing, site article for PPE. */
  code: string | null;
  name: string;
  /** Section from «Типи і розділи». */
  sectionId: number | null;
  season: ProductSeason | null;
  isActive: boolean;
  /** «Перевірено»: set by the director. */
  isVerified: boolean;
  /** Check date text, dd.mm.yyyy. */
  verifiedOn: string | null;
  /** Product page on the current public site; quotes take photos from it (temporary). */
  currentSiteUrl: string | null;
  /** «Короткий опис для КП». */
  quoteDescription: string | null;
  updatedAtUtc: string;
}
