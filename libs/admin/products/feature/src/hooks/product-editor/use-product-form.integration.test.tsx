import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useProductForm } from './use-product-form';

import type { ReactNode } from 'react';

const api = vi.hoisted(() => ({
  create: vi.fn(),
  replace: vi.fn(),
  errors: {} as Record<string, string>,
  navigate: vi.fn(),
}));

vi.mock('@admin/products/data-access', () => ({
  useCreateProductMutation: () => [api.create, { isLoading: false }],
  useReplaceProductMutation: () => [api.replace, { isLoading: false }],
}));
vi.mock('@admin/products/model', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  validateProductDraft: () => api.errors,
}));
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useNavigate: () => api.navigate,
}));

const wrapper = ({ children }: { children: ReactNode }) => <MemoryRouter>{children}</MemoryRouter>;

beforeEach(() => {
  api.errors = {};
  vi.clearAllMocks();
});

describe('useProductForm', () => {
  it('does not send a draft with field errors', async () => {
    api.errors = { name: 'Вкажіть назву.' };
    const { result } = renderHook(() => useProductForm({}), { wrapper });

    await act(() => result.current.save([]));

    expect(api.create).not.toHaveBeenCalled();
    expect(result.current.errors).toEqual({ name: 'Вкажіть назву.' });
    expect(result.current.message).toBe('Перевірте позначені поля.');
  });

  it('creates a new product under the typed id and opens it', async () => {
    api.create.mockReturnValue({ unwrap: () => Promise.resolve({ id: 42 }) });
    const { result } = renderHook(() => useProductForm({}), { wrapper });

    act(() => result.current.setNewId('42'));
    await act(() => result.current.save([]));

    expect(api.create).toHaveBeenCalledWith(expect.objectContaining({ id: 42 }));
    expect(api.navigate).toHaveBeenCalledWith('/references/products/42', {
      state: { product: { id: 42 } },
    });
  });

  it('shows the server field errors of a refused save', async () => {
    api.replace.mockReturnValue({
      unwrap: () =>
        Promise.reject({
          code: 'Validation',
          status: 400,
          message: 'Перевірте поля.',
          fieldErrors: { name: 'Така назва вже є.' },
        }),
    });
    const { result } = renderHook(() => useProductForm({ productId: 7 }), { wrapper });

    await act(() => result.current.save([]));

    expect(api.replace).toHaveBeenCalledWith(expect.objectContaining({ id: 7 }));
    expect(result.current.errors).toEqual({ name: 'Така назва вже є.' });
    expect(result.current.message).toBe('Перевірте поля.');
  });
});
