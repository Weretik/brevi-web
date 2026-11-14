import {
  useGetQuoteProductPhotosQuery,
  useUploadQuotePhotoMutation,
} from '@admin/quotes/data-access';
import { useState } from 'react';

import type { QuoteItemDraft } from '@admin/quotes/model';

export interface QuotePhotoChoice {
  key: string;
  url: string;
  previewUrl: string;
  label: string;
  badge?: string;
}

/** «Змінити фото»: own uploaded photos first, then the product card photos, and the chosen one. */
export function useQuotePhotoChoices(item: QuoteItemDraft) {
  const photos = useGetQuoteProductPhotosQuery(item.productId ?? 0, {
    skip: item.productId === null,
    refetchOnMountOrArgChange: true,
  });
  const [upload, uploading] = useUploadQuotePhotoMutation();
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selected, setSelected] = useState(item.photoUrl);

  const own: QuotePhotoChoice[] = uploaded.map((url, index) => ({
    key: `own-${index}`,
    url,
    previewUrl: url,
    label: `Своє фото ${index + 1}`,
    badge: 'Своє',
  }));
  const product: QuotePhotoChoice[] = (photos.data ?? []).map((photo, index) => ({
    key: `product-${photo.mediaFileId}`,
    url: photo.url,
    previewUrl: photo.thumbnailUrl ?? photo.url,
    label: `Фото ${index + 1}${photo.isMain ? ', головне' : ''}`,
    badge: photo.isMain ? 'Головне' : undefined,
  }));

  const uploadFile = async (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    try {
      const url = await upload(file).unwrap();
      setUploaded((current) => [url, ...current]);
      setSelected(url);
    } catch (cause) {
      setUploadError(
        (cause as { message?: string } | undefined)?.message ?? 'Не вдалося завантажити фото.',
      );
    }
  };

  return {
    photos,
    choices: [...own, ...product],
    selected,
    select: setSelected,
    uploadFile,
    uploading: uploading.isLoading,
    uploadError,
  };
}
