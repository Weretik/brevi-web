import type { OldSitePhotoImportReport } from '../../entities/product-photos/product-photos';

/** Adds up the reports of the parts of a real run (the server takes 20 products at a time). */
export function addOldSitePhotoImportReports(
  total: OldSitePhotoImportReport | null,
  part: OldSitePhotoImportReport,
): OldSitePhotoImportReport {
  if (!total) return part;
  return {
    dryRun: part.dryRun,
    products: total.products + part.products,
    found: total.found + part.found,
    modelsToCreate: total.modelsToCreate + part.modelsToCreate,
    modelsCreated: total.modelsCreated + part.modelsCreated,
    notFound: total.notFound + part.notFound,
    filesToDownload: total.filesToDownload + part.filesToDownload,
    filesDownloaded: total.filesDownloaded + part.filesDownloaded,
    photosAdded: total.photosAdded + part.photosAdded,
    lines: [...total.lines, ...part.lines],
  };
}
