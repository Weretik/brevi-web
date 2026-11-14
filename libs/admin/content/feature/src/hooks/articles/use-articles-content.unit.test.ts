import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useArticlesContent } from './use-articles-content';

const setVisibility = vi.hoisted(() => vi.fn());
const rows = [
  { id: 1, titleUk: 'Як обрати тканину', titleRu: null, slug: 'tkanyna' },
  { id: 2, titleUk: 'Розміри одягу', titleRu: null, slug: 'rozmiry' },
];

vi.mock('@admin/content/data-access', () => ({
  useGetContentArticlesQuery: () => ({ currentData: rows }),
  useSetContentArticleVisibilityMutation: () => [setVisibility],
}));
vi.mock('./use-old-site-article-import', () => ({ useOldSiteArticleImport: () => ({}) }));

describe('useArticlesContent', () => {
  it('narrows the articles by the search', () => {
    const { result } = renderHook(() => useArticlesContent());
    act(() => result.current.setTerm('розмір'));
    expect(result.current.shown.map((row) => row.id)).toEqual([2]);
  });

  it('shows why showing an article on the site failed', async () => {
    setVisibility.mockReturnValue({ unwrap: () => Promise.reject(new Error('boom')) });
    const { result } = renderHook(() => useArticlesContent());

    await act(() => result.current.toggle(rows[0] as never, true));

    expect(setVisibility).toHaveBeenCalledWith({ id: 1, showOnSite: true });
    expect(result.current.notice?.ok).toBe(false);
    expect(result.current.savingId).toBeNull();
  });
});
