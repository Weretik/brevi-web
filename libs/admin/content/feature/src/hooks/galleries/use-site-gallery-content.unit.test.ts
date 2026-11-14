import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useSiteGalleryContent } from './use-site-gallery-content';

const saveItems = vi.hoisted(() => vi.fn());
const gallery = {
  items: [
    { photoId: 5, title: { uk: 'Костюм', ru: '' } },
    { photoId: null, title: { uk: '', ru: '' } },
  ],
};

vi.mock('@admin/content/data-access', () => ({
  useGetSiteGalleryQuery: () => ({ currentData: gallery }),
}));
vi.mock('./use-site-gallery-actions', () => ({
  useSiteGalleryActions: () => ({ saveItems, saving: false, transferring: false, report: null }),
}));

describe('useSiteGalleryContent', () => {
  it('names pictures, lists the photos already used and is not full', () => {
    const { result } = renderHook(() => useSiteGalleryContent({ kind: 'works' }));

    expect(result.current.nameOf(0)).toBe('Костюм');
    expect(result.current.nameOf(1)).toMatch(/ 2$/);
    expect(result.current.takenIds).toEqual([5]);
    expect(result.current.full).toBe(false);
  });

  it('saves the list and reports success or the refusal', async () => {
    const { result } = renderHook(() => useSiteGalleryContent({ kind: 'works' }));

    saveItems.mockResolvedValueOnce(null);
    await act(() => result.current.saveList([], 'Збережено.'));
    expect(result.current.notice).toBe('Збережено.');

    saveItems.mockResolvedValueOnce('Конфлікт версій');
    await act(() => result.current.saveList([], 'Збережено.'));
    expect(result.current.error).toBe('Конфлікт версій');
  });
});
