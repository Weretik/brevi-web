import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useFabricConsumptionReport } from './use-fabric-consumption-report';

const query = vi.hoisted(() => vi.fn(() => ({ data: { rows: [], issuedValue: 1200 } })));

vi.mock('@admin/warehouse/data-access', () => ({ useGetFabricConsumptionQuery: query }));
vi.mock('@admin/warehouse/model', () => ({
  kyivToday: () => '2026-11-14',
  movementPeriodRange: () => ({ from: '2026-11-01', to: '2026-11-30' }),
  filterConsumption: (rows: unknown[]) => rows,
}));
vi.mock('../debounce/use-debounced-value', () => ({ useDebouncedValue: (value: string) => value }));

describe('useFabricConsumptionReport', () => {
  it('reads this month by default and shows value to people who see prices', () => {
    const { result } = renderHook(() => useFabricConsumptionReport());

    expect(query).toHaveBeenLastCalledWith(
      { from: '2026-11-01', to: '2026-11-30' },
      { skip: false },
    );
    expect(result.current.seesValue).toBe(true);
  });

  it('does not ask for a period whose start is after its end', () => {
    const { result } = renderHook(() => useFabricConsumptionReport());

    act(() => result.current.setDates({ from: '2026-11-20', to: '2026-11-01' }));

    expect(result.current.valid).toBe(false);
    expect(result.current.rows).toEqual([]);
  });
});
