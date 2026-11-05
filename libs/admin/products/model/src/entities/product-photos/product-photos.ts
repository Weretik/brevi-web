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
