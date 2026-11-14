import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useQuoteEmbroideryPicker } from './use-quote-embroidery-picker';

import type { Quote } from '@admin/quotes/model';

const add = vi.hoisted(() => vi.fn());
const items = [
  { id: 1, name: 'Логотип', price: 120 },
  { id: 2, name: 'Без ціни', price: null },
];

vi.mock('@admin/embroidery/data-access', () => ({
  useGetEmbroideryCalculationsQuery: () => ({ data: { items } }),
}));
vi.mock('@admin/quotes/data-access', () => ({
  useAddQuoteEmbroideryMutation: () => [add, { isLoading: false }],
}));

const quote = { id: 9 } as Quote;

describe('useQuoteEmbroideryPicker', () => {
  it('offers only priced calculations and adds the chosen one to the saved quote', async () => {
    add.mockResolvedValue({ data: quote });
    const onAdded = vi.fn();
    const { result } = renderHook(() =>
      useQuoteEmbroideryPicker({ ensureSaved: async () => quote, onAdded }),
    );
    expect(result.current.options.map((option) => option.id)).toEqual([1]);

    act(() => result.current.setCalculation(items[0] as never));
    await act(() => result.current.submit());

    expect(add).toHaveBeenCalledWith({ id: 9, calculationId: 1 });
    expect(onAdded).toHaveBeenCalledWith(quote);
  });

  it('marks a failed quote save and asks to choose a calculation first', async () => {
    const { result } = renderHook(() =>
      useQuoteEmbroideryPicker({ ensureSaved: async () => null, onAdded: vi.fn() }),
    );

    await act(() => result.current.submit());
    expect(result.current.tried).toBe(true);
    expect(result.current.saveFailed).toBe(false);

    act(() => result.current.setCalculation(items[0] as never));
    await act(() => result.current.submit());
    expect(result.current.saveFailed).toBe(true);
  });
});
