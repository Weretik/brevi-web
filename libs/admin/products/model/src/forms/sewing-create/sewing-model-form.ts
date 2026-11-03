import type { CreateCatalogProductInput } from '../../entities/product-create/product-create';
import type { ProductSeason } from '../../entities/product-overview/product-overview';

/** Step 1 «Модель» of «Нова модель»: the sheet tab «Товари» fields of a new sewing model. */
export interface SewingModelFormValues {
  code: string;
  name: string;
  sectionId: number | '';
  season: ProductSeason | '';
  currentSiteUrl: string;
  quoteDescription: string;
}

export type SewingModelField = keyof SewingModelFormValues;
export type SewingModelFieldErrors = Partial<Record<SewingModelField, string>>;

export const emptySewingModelForm: SewingModelFormValues = {
  code: '',
  name: '',
  sectionId: '',
  season: '',
  currentSiteUrl: '',
  quoteDescription: '',
};

/** A new model is saved as a draft: not active and not verified until it is launched. */
export function sewingModelCreateInput(values: SewingModelFormValues): CreateCatalogProductInput {
  return {
    type: 'Sewing',
    code: values.code.trim() || null,
    name: values.name.trim(),
    sectionId: Number(values.sectionId),
    season: values.season || null,
    isActive: false,
    isVerified: false,
    currentSiteUrl: values.currentSiteUrl.trim() || null,
    quoteDescription: values.quoteDescription.trim() || null,
    ppe: null,
  };
}
