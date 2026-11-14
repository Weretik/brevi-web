import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useFabricBookingReport } from './use-fabric-booking-report';

const can = vi.hoisted(() => vi.fn(() => true));

vi.mock('@admin/shared/ui', () => ({ usePageRights: () => ({ can }) }));
vi.mock('@admin/warehouse/data-access', () => ({
  useGetFabricBookingQuery: () => ({ data: { pairs: [], canReceive: true } }),
}));
vi.mock('@admin/warehouse/model', () => ({
  kyivToday: () => '2026-11-14',
  filterBooking: (pairs: unknown[]) => pairs,
  bookingToOrderSummary: () => ({ meters: 0 }),
  bookingViewCounts: () => ({ toOrder: 0, all: 0, unknown: 0 }),
}));
vi.mock('../debounce/use-debounced-value', () => ({ useDebouncedValue: (value: string) => value }));

describe('useFabricBookingReport', () => {
  it('offers «+ Прихід» only with the server right, the stock tab and «Створення» on stock', () => {
    expect(
      renderHook(() => useFabricBookingReport({ access: undefined })).result.current.canReceive,
    ).toBe(true);
    expect(
      renderHook(() => useFabricBookingReport({ access: { stock: false } as never })).result.current
        .canReceive,
    ).toBe(false);

    can.mockReturnValue(false);
    expect(
      renderHook(() => useFabricBookingReport({ access: undefined })).result.current.canReceive,
    ).toBe(false);
    expect(can).toHaveBeenCalledWith('create', 'fabric-stock');
  });
});
