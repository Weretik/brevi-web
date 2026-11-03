import type { ProductOverviewResponse } from '../../contracts/product-overview/product-overview.dto';
import type { ProductOverview } from '@admin/products/model';

export function mapProductOverview(value: ProductOverviewResponse): ProductOverview[] {
  return value.map((row) => ({
    id: row.id,
    type: row.type,
    code: row.code ?? null,
    name: row.name,
    sectionId: row.sectionId ?? null,
    season: row.season ?? null,
    isActive: row.isActive,
    isVerified: row.isVerified,
    verifiedOn: row.verifiedOn ?? null,
    currentSiteUrl: row.currentSiteUrl ?? null,
    quoteDescription: row.quoteDescription ?? null,
    updatedAtUtc: row.updatedAtUtc,
  }));
}
