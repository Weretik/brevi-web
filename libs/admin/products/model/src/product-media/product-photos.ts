import { removeOrdered } from '../ordering/product-order';

import type { ProductMedia } from './product-media';
import type { ProductDraft } from '../product-editor/product-draft.types';

type Photos = ProductDraft['photos'];

export function addReadyPhoto(photos: Photos, media: ProductMedia): Photos {
  if (media.status !== 'Ready' || photos.some((photo) => photo.mediaFileId === media.id))
    return photos;
  return [
    ...photos,
    {
      mediaFileId: media.id,
      alt: media.originalFileName,
      isVisible: true,
      isMain: photos.length === 0,
      sortOrder: photos.length,
    },
  ];
}

export function setMainPhoto(photos: Photos, index: number): Photos {
  return photos.map((photo, position) => ({ ...photo, isMain: position === index }));
}

export function removePhoto(photos: Photos, index: number): Photos {
  const remaining = removeOrdered(photos, index);
  return remaining.length > 0 && !remaining.some((photo) => photo.isMain)
    ? setMainPhoto(remaining, 0)
    : remaining;
}
