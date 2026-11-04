import type {
  OldSitePhotoImportReportResponse,
  ProductPhotoListResponse,
} from '../../contracts/product-photos/product-photos.dto';
import type { OldSitePhotoImportReport, ProductPhoto } from '@admin/products/model';

/** Photos in display order (CAT-018). */
export function mapProductPhotos(value: ProductPhotoListResponse): ProductPhoto[] {
  return [...value.photos]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((photo) => ({
      mediaFileId: photo.mediaFileId,
      fileName: photo.fileName ?? null,
      url: photo.url ?? null,
      thumbnailUrl: photo.thumbnailUrl ?? null,
      isMain: photo.isMain,
      missing: photo.missing,
    }));
}

export function mapOldSitePhotoImportReport(
  value: OldSitePhotoImportReportResponse,
): OldSitePhotoImportReport {
  return {
    dryRun: value.dryRun,
    products: value.products,
    found: value.found,
    modelsToCreate: value.modelsToCreate,
    modelsCreated: value.modelsCreated,
    notFound: value.notFound,
    filesToDownload: value.filesToDownload,
    filesDownloaded: value.filesDownloaded,
    photosAdded: value.photosAdded,
    lines: value.lines.map((line) => ({
      oldId: line.oldId,
      oldName: line.oldName,
      status: line.status,
      productId: line.productId ?? null,
      productName: line.productName ?? null,
      photosToAdd: line.photosToAdd,
      photosAdded: line.photosAdded,
      errors: line.errors,
    })),
  };
}
