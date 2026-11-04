/** One photo of a product card tab «Фото» (CAT-018). */
export interface ProductCardPhoto {
  mediaFileId: number;
  fileName: string | null;
  url: string | null;
  thumbnailUrl: string | null;
  isMain: boolean;
  /** The library no longer has the file. */
  missing: boolean;
}

/** A new model's season; the server accepts only these. */
export type OldSiteSeason = 'Літо' | 'Зима';

/** One old product of the file «old-site-photo-import.json». */
export interface OldSiteProduct {
  oldId: number;
  oldName: string;
  skus: string[];
  photos: { path: string; isMain: boolean }[];
  newModel: { name: string; section: string; season: OldSiteSeason | null } | null;
}

/** The whole file: the old-site image folder and the products. */
export interface OldSitePhotoImportFile {
  baseUrl: string;
  products: OldSiteProduct[];
}

export type OldSitePhotoImportStatus = 'Found' | 'Create' | 'Created' | 'NotFound';

export interface OldSitePhotoImportLine {
  oldId: number;
  oldName: string;
  status: OldSitePhotoImportStatus;
  productId: number | null;
  productName: string | null;
  photosToAdd: number;
  photosAdded: number;
  errors: string[];
}

/** What the import did, or would do for a check; parts of a real run are added up. */
export interface OldSitePhotoImportReport {
  dryRun: boolean;
  products: number;
  found: number;
  modelsToCreate: number;
  modelsCreated: number;
  notFound: number;
  filesToDownload: number;
  filesDownloaded: number;
  photosAdded: number;
  lines: OldSitePhotoImportLine[];
}
