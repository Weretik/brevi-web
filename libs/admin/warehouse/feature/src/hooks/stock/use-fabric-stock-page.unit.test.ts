import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useFabricStockPage } from './use-fabric-stock-page';

const fabrics = [{ fabricCode: 'FAB-1' }, { fabricCode: 'FAB-2' }];

vi.mock('@admin/shared/ui', () => ({ usePageRights: () => ({ canCreate: true }) }));
vi.mock('@admin/warehouse/data-access', () => ({
  useGetFabricStockQuery: () => ({ data: { fabrics, permissions: { canMove: true } } }),
}));
vi.mock('@admin/warehouse/model', () => ({
  searchFabricStock: (rows: unknown[]) => rows,
  filterFabricStock: (rows: unknown[]) => rows,
  sortFabricStock: (rows: unknown[]) => rows,
  stockProblemCounts: () => ({ all: 2 }),
}));

describe('useFabricStockPage', () => {
  it('keeps fabrics folded until opened, and opened while a search is on until folded', () => {
    const { result } = renderHook(() => useFabricStockPage());
    expect([...result.current.expanded]).toEqual([]);

    act(() => result.current.toggle('FAB-1'));
    expect([...result.current.expanded]).toEqual(['FAB-1']);

    act(() => result.current.setSearch('сарж'));
    expect([...result.current.expanded]).toEqual(['FAB-1', 'FAB-2']);

    act(() => result.current.toggle('FAB-2'));
    expect([...result.current.expanded]).toEqual(['FAB-1']);
  });

  it('lets a person who may create records move stock and closes the panel after a save', () => {
    const { result } = renderHook(() => useFabricStockPage());
    expect(result.current.canMove).toBe(true);

    act(() => result.current.setPanel({ kind: 'receipt' }));
    act(() => result.current.saved('Прихід записано.'));

    expect(result.current.panel).toBeNull();
    expect(result.current.message).toBe('Прихід записано.');
  });
});
