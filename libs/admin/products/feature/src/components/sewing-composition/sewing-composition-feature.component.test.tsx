import { act, cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SewingCompositionFeature } from './sewing-composition-feature';
import { render } from '../../test-utils';

vi.mock('../sewing-pricing/sewing-pricing-feature', () => ({ SewingPricingFeature: () => null }));

const hooks = vi.hoisted(() => ({
  useGetSewingAccessQuery: vi.fn(),
  useListSewingArticlesQuery: vi.fn(),
  useGetSewingCompositionQuery: vi.fn(),
  useCreateSewingArticleMutation: vi.fn(),
  useReplaceSewingCompositionMutation: vi.fn(),
  useReplaceSewingArticleCompositionMutation: vi.fn(),
  useListFabricsQuery: vi.fn(),
  useListGarmentAccessoriesQuery: vi.fn(),
  useListGarmentPartOperationsQuery: vi.fn(),
  createArticle: vi.fn(),
  replaceModel: vi.fn(),
  replaceArticle: vi.fn(),
  refetchModel: vi.fn(),
  refetchArticle: vi.fn(),
}));

vi.mock('@admin/products/data-access', () => ({
  useGetSewingAccessQuery: hooks.useGetSewingAccessQuery,
  useListSewingArticlesQuery: hooks.useListSewingArticlesQuery,
  useGetSewingCompositionQuery: hooks.useGetSewingCompositionQuery,
  useCreateSewingArticleMutation: hooks.useCreateSewingArticleMutation,
  useReplaceSewingCompositionMutation: hooks.useReplaceSewingCompositionMutation,
  useReplaceSewingArticleCompositionMutation: hooks.useReplaceSewingArticleCompositionMutation,
}));

vi.mock('@admin/references/data-access', () => ({
  useListFabricsQuery: hooks.useListFabricsQuery,
  useListGarmentAccessoriesQuery: hooks.useListGarmentAccessoriesQuery,
  useListGarmentPartOperationsQuery: hooks.useListGarmentPartOperationsQuery,
}));

const sharedView = {
  productId: 42,
  articleId: null,
  modelCode: 'MOD-025',
  version: 5,
  materials: [
    {
      id: 100,
      articleId: null,
      scope: 'Model' as const,
      kind: 'Accessory' as const,
      referenceId: 7,
      costCode: null,
      quantity: 2,
      unit: 'Piece' as const,
      required: true,
      sortOrder: 0,
      reviewed: true,
      reviewedBy: 'admin',
      reviewedAt: '2026-10-20T09:00:00Z',
    },
  ],
  operations: [
    {
      id: 300,
      operationId: 11,
      quantity: 1,
      manualMinutes: 4,
      sortOrder: 0,
      reviewed: true,
      reviewedBy: 'admin',
      reviewedAt: '2026-10-20T09:00:00Z',
    },
  ],
  blockers: [],
};

const articleView = {
  productId: 42,
  articleId: 501,
  modelCode: 'MOD-025',
  version: 5,
  materials: [
    ...sharedView.materials,
    {
      id: 200,
      articleId: 501,
      scope: 'Article' as const,
      kind: 'Fabric' as const,
      referenceId: 9,
      costCode: null,
      quantity: 3.6,
      unit: 'Metre' as const,
      required: true,
      sortOrder: 0,
      reviewed: true,
      reviewedBy: 'admin',
      reviewedAt: '2026-10-20T09:00:00Z',
    },
  ],
  operations: sharedView.operations,
  blockers: ['Іншу витрату не перевірено'],
};

function setQueryState(data: unknown, refetch = vi.fn()) {
  return {
    data,
    error: undefined,
    isError: false,
    isFetching: false,
    isLoading: false,
    isSuccess: true,
    refetch,
  };
}

function setupFeature() {
  hooks.useGetSewingAccessQuery.mockReturnValue(setQueryState({ canRead: true, canManage: true }));
  hooks.useListSewingArticlesQuery.mockReturnValue(
    setQueryState({
      productId: 42,
      modelCode: 'MOD-025',
      version: 5,
      articles: [{ id: 501, productId: 42, saleSku: '246', active: true, sortOrder: 0 }],
    }),
  );
  hooks.useGetSewingCompositionQuery.mockImplementation((args: { articleId: number | null }) =>
    args.articleId === null
      ? setQueryState(sharedView, hooks.refetchModel)
      : setQueryState(articleView, hooks.refetchArticle),
  );
  hooks.useListFabricsQuery.mockReturnValue(
    setQueryState([{ id: 9, name: 'Тканина 9', providerName: 'Постачальник', price: 100 }]),
  );
  hooks.useListGarmentAccessoriesQuery.mockReturnValue(
    setQueryState([{ id: 7, name: 'Ґудзик', supplierName: 'Постачальник', price: 2 }]),
  );
  hooks.useListGarmentPartOperationsQuery.mockReturnValue(
    setQueryState([{ id: 11, name: 'Пошиття', garmentPartName: 'Куртка', min: 4 }]),
  );
  hooks.createArticle.mockImplementation(() => ({
    unwrap: () =>
      Promise.resolve({ id: 502, productId: 42, saleSku: '247', active: true, sortOrder: 1 }),
  }));
  hooks.replaceModel.mockImplementation(() => ({ unwrap: () => Promise.resolve(sharedView) }));
  hooks.replaceArticle.mockImplementation(() => ({ unwrap: () => Promise.resolve(articleView) }));
  hooks.refetchModel.mockResolvedValue({ isSuccess: true, data: sharedView });
  hooks.refetchArticle.mockResolvedValue({ isSuccess: true, data: articleView });
  hooks.useCreateSewingArticleMutation.mockReturnValue([hooks.createArticle, { isLoading: false }]);
  hooks.useReplaceSewingCompositionMutation.mockReturnValue([
    hooks.replaceModel,
    { isLoading: false },
  ]);
  hooks.useReplaceSewingArticleCompositionMutation.mockReturnValue([
    hooks.replaceArticle,
    { isLoading: false },
  ]);
}

function editArticleQuantity(value: string) {
  const fields = screen.getAllByRole('spinbutton', { name: 'Кількість' });
  fireEvent.change(fields.at(-1)!, { target: { value } });
}

function renderFeature(initialEntries = ['/']) {
  const router = createMemoryRouter(
    [
      { path: '/destination', element: <p>Destination</p> },
      { path: '/', element: <SewingCompositionFeature productId={42} /> },
    ],
    { initialEntries },
  );
  render(<RouterProvider router={router} />);
  return router;
}

async function selectArticle() {
  expect(screen.getByText(/Готовність не перевірена/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Артикул 246/ }));
  expect(await screen.findByRole('heading', { name: 'Склад артикулу 246' })).toBeInTheDocument();
}

beforeEach(setupFeature);
afterEach(cleanup);

describe('SewingCompositionFeature', () => {
  it('prompts before switching scope or creating an Article with a dirty draft', async () => {
    renderFeature();
    await selectArticle();
    editArticleQuantity('4');

    fireEvent.click(screen.getByRole('button', { name: 'Спільний склад моделі' }));
    expect(screen.getByRole('dialog', { name: 'Незбережені зміни' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Залишитися' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() =>
      expect(screen.getAllByRole('spinbutton', { name: 'Кількість' }).at(-1)).toHaveValue(4),
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'SKU артикулу' }), {
      target: { value: '247' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Додати артикул' }));
    expect(screen.getByRole('dialog', { name: 'Незбережені зміни' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Залишитися' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: 'SKU артикулу' })).toHaveValue('247'),
    );
    expect(hooks.createArticle).not.toHaveBeenCalled();
  });

  it('saves only Article-specific lines and keeps common composition separate', async () => {
    renderFeature();
    await selectArticle();
    expect(screen.getByRole('heading', { name: 'Спільний склад моделі' })).toBeInTheDocument();
    expect(screen.getByText('Спільні операції')).toBeInTheDocument();
    editArticleQuantity('4');
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти склад' }));

    await waitFor(() => expect(hooks.replaceArticle).toHaveBeenCalled());
    const savedDraft = hooks.replaceArticle.mock.calls.at(-1)?.[0];
    expect(savedDraft.articleId).toBe(501);
    expect(savedDraft.modelMaterials).toHaveLength(1);
    expect(savedDraft.articleMaterials).toHaveLength(1);
    expect(savedDraft.articleMaterials[0]).toMatchObject({ referenceId: 9, quantity: 4 });
  });

  it('preserves the stale Article draft until the user explicitly reloads latest data', async () => {
    const latest = {
      ...articleView,
      version: 6,
      materials: articleView.materials.map((line) =>
        line.id === 200 ? { ...line, quantity: 2 } : line,
      ),
    };
    hooks.replaceArticle.mockImplementation(() => ({
      unwrap: () =>
        Promise.reject({
          code: 'Conflict',
          status: 409,
          message: 'Склад змінився на сервері.',
          fieldErrors: {},
        }),
    }));
    hooks.refetchArticle.mockResolvedValue({ isSuccess: true, data: latest });
    renderFeature();
    await selectArticle();
    editArticleQuantity('4');
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти склад' }));

    expect(await screen.findByText(/Чернетку збережено/)).toBeInTheDocument();
    expect(screen.getAllByRole('spinbutton', { name: 'Кількість' }).at(-1)).toHaveValue(4);
    expect(hooks.replaceArticle.mock.calls.at(-1)?.[0].version).toBe(5);

    fireEvent.click(screen.getByRole('button', { name: 'Завантажити актуальну версію' }));
    await waitFor(() =>
      expect(screen.getAllByRole('spinbutton', { name: 'Кількість' }).at(-1)).toHaveValue(2),
    );
    expect(hooks.refetchArticle).toHaveBeenCalled();
  });

  it('blocks browser history navigation until the user stays or discards the draft', async () => {
    const router = renderFeature(['/destination', '/']);
    await selectArticle();
    editArticleQuantity('4');

    await act(async () => {
      await router.navigate(-1);
    });
    expect(screen.getByRole('dialog', { name: 'Незбережені зміни' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Залишитися' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(router.state.location.pathname).toBe('/');
    expect(screen.getAllByRole('spinbutton', { name: 'Кількість' }).at(-1)).toHaveValue(4);

    await act(async () => {
      await router.navigate(-1);
    });
    expect(screen.getByRole('dialog', { name: 'Незбережені зміни' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Вийти без збереження' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/destination'));
    expect(screen.getByText('Destination')).toBeInTheDocument();
  });
});
