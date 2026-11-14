import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { useFabricNormsPage } from './use-fabric-norms-page';

import type { ReactNode } from 'react';

const rows = [
  { modelCode: '992', modelName: 'Флісова куртка' },
  { modelCode: '410', modelName: 'Халат' },
];

vi.mock('@admin/production/data-access', () => ({
  useImportFabricNormsMutation: () => [vi.fn()],
}));
vi.mock('./use-fabric-norms', () => ({
  useFabricNorms: () => ({ rows, loading: false, error: null, reload: vi.fn() }),
}));
vi.mock('./use-model-compositions', () => ({
  useModelCompositions: () => ({ rows: [{ modelCode: '410', parts: [] }] }),
}));
vi.mock('./use-fabric-norm-deletion', () => ({ useFabricNormDeletion: () => ({}) }));

function wrapper({ children }: { children: ReactNode }) {
  return <MemoryRouter initialEntries={['/production/norms?model=410']}>{children}</MemoryRouter>;
}

describe('useFabricNormsPage', () => {
  it('opens the model named in the address with its composition', () => {
    const { result } = renderHook(() => useFabricNormsPage(), { wrapper });

    expect(result.current.selected?.modelCode).toBe('410');
    expect(result.current.composition).toEqual({ modelCode: '410', parts: [] });
  });

  it('selects another model, searches, and reads the batch size', () => {
    const { result } = renderHook(() => useFabricNormsPage(), { wrapper });

    act(() => result.current.select(rows[0] as never));
    expect(result.current.selected?.modelCode).toBe('992');

    act(() => {
      result.current.setSearch('халат');
      result.current.setBatchText('25');
    });
    expect(result.current.filtered.map((row) => row.modelCode)).toEqual(['410']);
    expect(result.current.batchSize).toBe(25);
  });
});
