export const MEDIA_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
/** Same limit as the backend setting MediaUpload:MaxFileSizeBytes. */
export const MEDIA_MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;
export const MEDIA_FILE_NAME_MAX_LENGTH = 255;
export const MEDIA_ALT_MAX_LENGTH = 300;

export interface MediaFile {
  id: number;
  fileName: string;
  alt: string | null;
  /** Null when the photo is not in any folder. */
  folderId: number | null;
  publicUrl: string;
  /** WebP preview (480 px); null for small photos and until the nightly sync makes it. */
  thumbnailUrl: string | null;
  contentType: string;
  sizeInBytes: number;
  width: number | null;
  height: number | null;
  createdAt: string;
}

export interface MediaFilePage {
  items: MediaFile[];
  total: number;
  page: number;
  pageSize: number;
}

/** A place that uses the photo, for example a product. */
export interface MediaUsage {
  area: string;
  ownerId: number;
  title: string;
}

export interface MediaFileDetail {
  file: MediaFile;
  usages: MediaUsage[];
}

export interface MediaFileDraft {
  fileName: string;
  alt: string;
  folderId: number | null;
}

export interface MediaFileQuery {
  folderId: number | null;
  includeSubfolders: boolean;
  search: string;
  page: number;
  pageSize: number;
}
