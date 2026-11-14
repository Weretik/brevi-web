import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useSiteGalleryItemForm } from './use-site-gallery-item-form';

import type { SiteGalleryItem } from '@admin/content/model';

const item: SiteGalleryItem = {
  photoId: 1,
  legacyPath: null,
  url: 'https://media.example/1.webp',
  thumbnailUrl: 'https://media.example/1-thumb.webp',
  width: 800,
  height: 600,
  title: { uk: 'Костюм', ru: 'Костюм' },
  note: { uk: '', ru: '' },
  standards: [],
} as unknown as SiteGalleryItem;

describe('useSiteGalleryItemForm', () => {
  it('saves the edited picture and shows the reason a save was refused', async () => {
    const onSubmit = vi.fn().mockResolvedValue('Фото вже є в списку.');
    const { result } = renderHook(() => useSiteGalleryItemForm('works', item, onSubmit));

    act(() => result.current.setValues({ ...result.current.values, titleUk: 'Нова назва' }));
    await act(() => result.current.submit());

    expect(onSubmit.mock.calls[0][0].title.uk).toBe('Нова назва');
    expect(result.current.message).toBe('Фото вже є в списку.');
  });

  it('replaces the photo but keeps the texts', () => {
    const { result } = renderHook(() => useSiteGalleryItemForm('works', item, vi.fn()));

    act(() => result.current.setPicking(true));
    act(() =>
      result.current.replacePhoto({
        id: 2,
        publicUrl: 'https://media.example/2.webp',
        thumbnailUrl: null,
        width: null,
        height: null,
      }),
    );

    expect(result.current.picking).toBe(false);
    expect(result.current.photo.photoId).toBe(2);
    expect(result.current.photo.title).toEqual(item.title);
  });
});
