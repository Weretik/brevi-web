import type { EmbroideryCalculation, EmbroideryCalculationRequest } from './embroidery-calculation';
import type { EmbroideryMode } from './embroidery-codes';
import type { EmbroideryMarkup, EmbroideryRates } from './embroidery-settings';

export interface EmbroiderySavedPrice {
  name: string;
  unit: number;
  total: number;
  repeatUnit: number;
}

/** One row of «Збережені». */
export interface EmbroiderySavedSummary {
  id: number;
  /** «ВШ-0042». */
  number: string;
  /** Empty means «Без назви». */
  name: string;
  customerPublicId: string | null;
  customerName: string | null;
  mode: EmbroideryMode;
  quantity: number;
  stitchesPerUnit: number;
  hoopLabel: string;
  /** Some costs had no rate: the prices were «Орієнтовна». */
  incomplete: boolean;
  /** The one price category kept when saving («Категорія 1»); null only for a calculation without prices. */
  price: EmbroiderySavedPrice | null;
  createdAt: string;
  createdByName: string;
  /** «Макет» from «Медіа»: a photo of the design for the workshop; null when none. */
  mockup: EmbroideryMockup | null;
}

export interface EmbroideryMockup {
  mediaFileId: number;
  fileName: string;
  url: string;
  thumbnailUrl: string | null;
}

export interface EmbroiderySavedPage {
  items: readonly EmbroiderySavedSummary[];
  page: number;
  pageSize: number;
  total: number;
}

/** The rates frozen at saving; Director and Admin only. */
export interface EmbroiderySavedRates {
  stitchRate: number;
  rates: EmbroideryRates;
  markups: readonly EmbroideryMarkup[];
}

/** A saved calculation as it was saved; it is never recalculated. */
export interface EmbroiderySavedCalculation {
  summary: EmbroiderySavedSummary;
  input: EmbroideryCalculationRequest;
  result: EmbroideryCalculation;
  rates: EmbroiderySavedRates | null;
}

/** What «Зберегти розрахунок» sends; the server prices it again with the current rates. */
export interface EmbroiderySaveRequest {
  name: string;
  customerPublicId: string | null;
  calculation: EmbroideryCalculationRequest;
  /** The one price category kept: «Категорія 1» or «Категорія 2». */
  category: string;
}
