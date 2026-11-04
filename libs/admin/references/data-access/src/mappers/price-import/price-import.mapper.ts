import type {
  PriceImportResponse,
  PriceSourcesResponse,
} from '../../contracts/price-import/price-import-response';
import type { PriceImportResult, PriceSourceList } from '@admin/references/model';

export function mapPriceSources(response: PriceSourcesResponse): PriceSourceList {
  return {
    canChangeDiscounts: response.canChangeDiscounts,
    sources: response.sources.map((source) => ({
      key: source.key,
      title: source.title,
      method: source.method,
      schedule: source.schedule,
      logic: source.logic,
      discountPercent: source.discountPercent,
      defaultDiscountPercent: source.defaultDiscountPercent,
      supplierId: source.supplierId,
      supplierName: source.supplierName,
      productCount: source.productCount,
      manualPriceCount: source.manualPriceCount,
      fileKind: source.fileKind,
      fileCount: source.fileCount,
      automaticUpdateConnected: source.automaticUpdateConnected,
      settingsUpdatedAt: source.settingsUpdatedAt,
      settingsUpdatedBy: source.settingsUpdatedBy,
      lastRun: source.lastRun && {
        trigger: source.lastRun.trigger,
        actor: source.lastRun.actor,
        finishedAt: source.lastRun.finishedAt,
        checked: source.lastRun.checked,
        changed: source.lastRun.changed,
        unchanged: source.lastRun.unchanged,
        skipped: source.lastRun.skipped,
        problems: source.lastRun.problems.map((problem) => ({ ...problem })),
      },
    })),
  };
}

export function mapPriceImportResult(response: PriceImportResponse): PriceImportResult {
  return {
    applied: response.applied,
    discountPercent: response.discountPercent,
    checked: response.checked,
    changed: response.changed,
    unchanged: response.unchanged,
    skipped: response.skipped,
    rows: response.rows.map((row) => ({ ...row })),
  };
}
