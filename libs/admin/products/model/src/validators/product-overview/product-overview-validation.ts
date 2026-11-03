import type {
  ProductOverviewType,
  ProductSeason,
} from '../../entities/product-overview/product-overview';

export interface ProductOverviewFormValues {
  code: string;
  sectionId: number | '';
  season: ProductSeason | '';
  isActive: boolean;
  isVerified: boolean;
  currentSiteUrl: string;
  quoteDescription: string;
}

export type ProductOverviewField = keyof ProductOverviewFormValues;
export type ProductOverviewFieldErrors = Partial<Record<ProductOverviewField, string>>;

/** Limits shared with BreviERP `Product.Overview`. */
export const productOverviewLimits = {
  code: 80,
  currentSiteUrl: 500,
  quoteDescription: 2000,
} as const;

function isWebUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export function validateProductOverview(
  values: ProductOverviewFormValues,
  type: ProductOverviewType,
): ProductOverviewFieldErrors {
  const errors: ProductOverviewFieldErrors = {};
  const code = values.code.trim();
  if (!code && type === 'Ppe') errors.code = 'Вкажіть артикул сайту.';
  else if (code.length > productOverviewLimits.code)
    errors.code = `Не більше ${productOverviewLimits.code} символів.`;
  const url = values.currentSiteUrl.trim();
  if (url && (url.length > productOverviewLimits.currentSiteUrl || !isWebUrl(url)))
    errors.currentSiteUrl = 'Посилання має починатися з https:// і бути до 500 символів.';
  if (values.quoteDescription.trim().length > productOverviewLimits.quoteDescription)
    errors.quoteDescription = `Не більше ${productOverviewLimits.quoteDescription} символів.`;
  return errors;
}
