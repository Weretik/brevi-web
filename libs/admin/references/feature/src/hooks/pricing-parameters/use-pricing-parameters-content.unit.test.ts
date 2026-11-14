import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { usePricingParametersContent } from './use-pricing-parameters-content';

const rows = [{ id: 1 }, { id: 2 }];
const filterPricingParameters = vi.hoisted(() => vi.fn(() => [{ id: 2 }]));

vi.mock('@admin/references/model', () => ({
  filterPricingParameters,
  listPricingParameterSections: () => [{ value: 'Пошив', count: 2 }],
}));
vi.mock('@admin/references/data-access', () => ({
  useDeletePricingParameterMutation: () => [vi.fn()],
}));
vi.mock('./use-pricing-lists', () => ({
  usePricingParameters: () => ({ rows, loading: false, error: null, reload: vi.fn() }),
}));
vi.mock('../reference-lists/use-reference-deletion', () => ({ useReferenceDeletion: () => ({}) }));

describe('usePricingParametersContent', () => {
  it('filters the parameters by the search and the section chip', () => {
    const { result } = renderHook(() => usePricingParametersContent());

    act(() => {
      result.current.setSearch('нац');
      result.current.setSection('Пошив');
    });

    expect(filterPricingParameters).toHaveBeenLastCalledWith(rows, 'нац', 'Пошив');
    expect(result.current.filteredRows).toEqual([{ id: 2 }]);
    expect(result.current.sections).toEqual([{ value: 'Пошив', count: 2 }]);
  });

  it('opens the side panel and keeps the message', () => {
    const { result } = renderHook(() => usePricingParametersContent());

    act(() => {
      result.current.setActive({ mode: 'create', parameter: null });
      result.current.setActionMessage('Збережено.');
    });

    expect(result.current.active?.mode).toBe('create');
    expect(result.current.actionMessage).toBe('Збережено.');
  });
});
