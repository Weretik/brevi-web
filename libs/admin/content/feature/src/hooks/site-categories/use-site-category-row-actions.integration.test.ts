import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useSiteCategoryRowActions } from './use-site-category-row-actions';

import type { SiteCategoryRow } from '@admin/content/model';

const api = vi.hoisted(() => ({ setVisibility: vi.fn(), reorder: vi.fn() }));

vi.mock('@admin/content/data-access', () => ({
  useSetSiteCategoryVisibilityMutation: () => [api.setVisibility],
  useReorderSiteCategoriesMutation: () => [api.reorder],
}));

const row = (id: number, sortOrder: number, patch: Partial<SiteCategoryRow> = {}) =>
  ({
    id,
    parentId: null,
    slug: `s${id}`,
    sortOrder,
    showOnSite: true,
    onSite: true,
    nameUk: `Розділ ${id}`,
    nameRu: null,
    ...patch,
  }) as SiteCategoryRow;

const rows = [row(1, 1), row(2, 2)];

describe('useSiteCategoryRowActions', () => {
  it('warns when a shown subcategory stays hidden by its parent', async () => {
    api.setVisibility.mockReturnValue({
      unwrap: () => Promise.resolve({ showOnSite: true, onSite: false }),
    });
    const { result } = renderHook(() => useSiteCategoryRowActions(rows));

    await act(() => result.current.toggle(rows[0], true));

    expect(api.setVisibility).toHaveBeenCalledWith({ id: 1, showOnSite: true });
    expect(result.current.notice?.ok).toBe(false);
    expect(result.current.notice?.text).toContain('верхнього рівня приховано');
    expect(result.current.savingId).toBeNull();
  });

  it('reports a failed reorder and ignores a move past the edge', async () => {
    api.reorder.mockReturnValue({ unwrap: () => Promise.reject(new Error('Конфлікт')) });
    const { result } = renderHook(() => useSiteCategoryRowActions(rows));

    await act(async () => result.current.move(rows[0], -1));
    expect(api.reorder).not.toHaveBeenCalled();
    await act(async () => result.current.move(rows[0], 1));

    expect(api.reorder).toHaveBeenCalled();
    expect(result.current.notice).toEqual({ text: 'Конфлікт', ok: false });
  });

  it('shows a success notice from the side panel', () => {
    const { result } = renderHook(() => useSiteCategoryRowActions(rows));

    act(() => result.current.setNotice({ text: 'Збережено.', ok: true }));

    expect(result.current.notice).toEqual({ text: 'Збережено.', ok: true });
  });
});
