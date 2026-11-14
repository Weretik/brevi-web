import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useRedirectsContent } from './use-redirects-content';

const rows = [
  { id: 1, fromPath: '/old-a', toPath: '/uk/a', note: null, source: 'Manual' },
  { id: 2, fromPath: '/old-b', toPath: '/uk/b', note: 'Зі старого сайту', source: 'OldSite' },
];

vi.mock('@admin/content/data-access', () => ({
  useGetSiteRedirectsQuery: () => ({ currentData: rows }),
}));
vi.mock('./use-old-site-redirect-import', () => ({ useOldSiteRedirectImport: () => ({}) }));

describe('useRedirectsContent', () => {
  it('filters the redirects by text and by source', () => {
    const { result } = renderHook(() => useRedirectsContent());
    expect(result.current.shown).toHaveLength(2);

    act(() => result.current.setSource('OldSite' as never));
    expect(result.current.shown.map((row) => row.id)).toEqual([2]);

    act(() => {
      result.current.setSource(null);
      result.current.setTerm('old-a');
    });
    expect(result.current.shown.map((row) => row.id)).toEqual([1]);
  });
});
