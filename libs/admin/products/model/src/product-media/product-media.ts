export interface ProductMainPhoto {
  mediaFileId: number;
  url: string;
}

export interface ProductMedia {
  id: number;
  originalFileName: string;
  publicUrl: string;
  contentType: string;
  status: 'PendingUpload' | 'Ready';
}

export interface ProductPhoto {
  mediaFileId: number;
  alt?: string | null;
  isVisible: boolean;
  isMain: boolean;
  sortOrder: number;
}
