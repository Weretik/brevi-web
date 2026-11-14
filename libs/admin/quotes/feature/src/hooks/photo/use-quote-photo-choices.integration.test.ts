import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useQuotePhotoChoices } from './use-quote-photo-choices';

import type { QuoteItemDraft } from '@admin/quotes/model';

const api = vi.hoisted(() => ({ upload: vi.fn(), skip: null as boolean | null }));

vi.mock('@admin/quotes/data-access', () => ({
  useGetQuoteProductPhotosQuery: (_id: number, options: { skip: boolean }) => {
    api.skip = options.skip;
    return {
      data: [
        {
          mediaFileId: 1,
          url: 'https://cdn/a.jpg',
          thumbnailUrl: 'https://cdn/a-s.jpg',
          isMain: true,
        },
        { mediaFileId: 2, url: 'https://cdn/b.jpg', thumbnailUrl: null, isMain: false },
      ],
    };
  },
  useUploadQuotePhotoMutation: () => [api.upload, { isLoading: false }],
}));

const item = { productId: 5, photoUrl: 'https://cdn/a.jpg' } as QuoteItemDraft;

describe('useQuotePhotoChoices', () => {
  it('lists the product photos with the main one marked and starts on the item photo', () => {
    const { result } = renderHook(() => useQuotePhotoChoices(item));

    expect(result.current.choices.map((x) => x.label)).toEqual(['Фото 1, головне', 'Фото 2']);
    expect(result.current.choices[1].previewUrl).toBe('https://cdn/b.jpg');
    expect(result.current.selected).toBe('https://cdn/a.jpg');
  });

  it('puts an uploaded photo first and selects it', async () => {
    api.upload.mockReturnValue({ unwrap: () => Promise.resolve('https://cdn/own.jpg') });
    const { result } = renderHook(() => useQuotePhotoChoices(item));

    await act(() => result.current.uploadFile(new File(['x'], 'own.jpg')));

    expect(result.current.choices[0]).toMatchObject({ label: 'Своє фото 1', badge: 'Своє' });
    expect(result.current.selected).toBe('https://cdn/own.jpg');
  });

  it('shows why an upload failed and skips photos of an item without a product', async () => {
    api.upload.mockReturnValue({ unwrap: () => Promise.reject({ message: 'Файл завеликий.' }) });
    const { result } = renderHook(() =>
      useQuotePhotoChoices({ ...item, productId: null } as QuoteItemDraft),
    );

    await act(() => result.current.uploadFile(new File(['x'], 'own.jpg')));

    expect(api.skip).toBe(true);
    expect(result.current.uploadError).toBe('Файл завеликий.');
  });
});
