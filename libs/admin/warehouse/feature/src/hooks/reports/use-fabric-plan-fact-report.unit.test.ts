import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useFabricPlanFactReport } from './use-fabric-plan-fact-report';

const query = vi.hoisted(() => vi.fn(() => ({ data: { models: [], total: null } })));

vi.mock('@admin/warehouse/data-access', () => ({ useGetFabricPlanFactQuery: query }));
vi.mock('@admin/warehouse/model', () => ({
  filterPlanFact: (models: unknown[]) => models,
  planFactDeviation: () => null,
}));
vi.mock('../debounce/use-debounced-value', () => ({ useDebouncedValue: (value: string) => value }));

describe('useFabricPlanFactReport', () => {
  it('asks the server for the chosen period and skips a reversed one', () => {
    const { result } = renderHook(() => useFabricPlanFactReport());
    expect(query).toHaveBeenLastCalledWith({ from: null, to: null }, { skip: false });

    act(() => result.current.setFilter({ from: '2026-11-10', to: '2026-11-01' }));

    expect(result.current.valid).toBe(false);
    expect(query).toHaveBeenLastCalledWith(
      { from: '2026-11-10', to: '2026-11-01' },
      { skip: true },
    );
  });
});
