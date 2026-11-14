import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useProductSectionsPage } from './use-product-sections-page';

const rows = [{ id: 1 }, { id: 2 }];
const filterProductSections = vi.hoisted(() => vi.fn(() => [{ id: 1 }]));

vi.mock('@admin/references/model', () => ({ filterProductSections }));
vi.mock('@admin/references/data-access', () => ({
  useDeleteProductSectionMutation: () => [vi.fn()],
}));
vi.mock('./use-product-sections', () => ({
  useProductSections: () => ({ rows, loading: false, error: null, reload: vi.fn() }),
}));
vi.mock('../reference-lists/use-reference-deletion', () => ({ useReferenceDeletion: () => ({}) }));

describe('useProductSectionsPage', () => {
  it('filters the sections by the search and the type chip', () => {
    const { result } = renderHook(() => useProductSectionsPage());

    act(() => {
      result.current.setSearch('костюми');
      result.current.setType('Sewing' as never);
    });

    expect(filterProductSections).toHaveBeenLastCalledWith(rows, 'костюми', 'Sewing');
    expect(result.current.filteredRows).toEqual([{ id: 1 }]);
  });
});
