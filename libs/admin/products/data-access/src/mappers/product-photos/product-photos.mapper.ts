import type { ProductPhotoListResponse } from '../../contracts/product-photos/product-photos.dto';
import type { ProductCardPhoto } from '@admin/products/model';

/** Photos in display order (CAT-018). */
export function mapProductPhotos(value: ProductPhotoListResponse): ProductCardPhoto[] {
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
