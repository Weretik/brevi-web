import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useProductionOrdersPage } from './use-production-orders-page';

const summary = vi.hoisted(() => vi.fn());

vi.mock('./use-production-orders', () => ({
  useProductionOrders: () => ({
    query: { search: '' },
    page: { attention: { overdue: 2, dueSoon: 1 } },
  }),
}));
vi.mock('./use-production-model-summary', () => ({ useProductionModelSummary: summary }));
vi.mock('./use-production-orders-export', () => ({ useProductionOrdersExport: () => ({}) }));
vi.mock('./use-order-quick-param', () => ({ useOrderQuickParam: () => ({ orderId: null }) }));

describe('useProductionOrdersPage', () => {
  it('loads the model summary only on the summary view', () => {
    const { result } = renderHook(() => useProductionOrdersPage());
    expect(summary).toHaveBeenLastCalledWith({ search: '' }, false);
    expect(result.current.attention).toEqual({ overdue: 2, dueSoon: 1 });

    act(() => result.current.setView('summary'));
    expect(summary).toHaveBeenLastCalledWith({ search: '' }, true);
  });

  it('opens an import and the filter panel', () => {
    const { result } = renderHook(() => useProductionOrdersPage());

    act(() => {
      result.current.setImporting('orders' as never);
      result.current.setFiltersOpen(true);
    });

    expect(result.current.importing).toBe('orders');
    expect(result.current.filtersOpen).toBe(true);
  });
});
