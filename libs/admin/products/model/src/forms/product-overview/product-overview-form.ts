import type { ProductOverview } from '../../entities/product-overview/product-overview';
import type { ProductOverviewFormValues } from '../../validators/product-overview/product-overview-validation';

export function createProductOverviewFormValues(row: ProductOverview): ProductOverviewFormValues {
  return {
    code: row.code ?? '',
    sectionId: row.sectionId ?? '',
    season: row.season ?? '',
    isActive: row.isActive,
    isVerified: row.isVerified,
    currentSiteUrl: row.currentSiteUrl ?? '',
    quoteDescription: row.quoteDescription ?? '',
  };
}

/**
 * Request body of `PUT /api/v1/products/{id}/overview`. A row that stays checked keeps its date; a newly
 * checked row sends no date, so Brevi sets today.
 */
export function productOverviewBody(values: ProductOverviewFormValues, row: ProductOverview) {
  return {
    code: values.code.trim() || null,
    sectionId: values.sectionId === '' ? null : values.sectionId,
    season: row.type === 'Sewing' && values.season ? values.season : null,
    isActive: values.isActive,
    isVerified: values.isVerified,
    verifiedOn: values.isVerified && row.isVerified ? row.verifiedOn : null,
    currentSiteUrl: values.currentSiteUrl.trim() || null,
    quoteDescription: values.quoteDescription.trim() || null,
  };
}
