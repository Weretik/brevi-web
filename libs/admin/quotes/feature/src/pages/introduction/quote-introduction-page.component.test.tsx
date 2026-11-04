import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import QuoteIntroductionPage from './quote-introduction-page';

import type { QuoteCatalogProduct, QuoteIntroDraft } from '@admin/quotes/model';

const product = (id: number, season = 'Літо'): QuoteCatalogProduct => ({
  productId: id,
  kind: 'Sewing',
  code: `MOD-${id}`,
  name: `Модель ${id}`,
  season,
  photoUrl: null,
  description: null,
  prices: null,
  problem: null,
  variants: [
    {
      articleId: id * 100,
      sku: `S-${id}`,
      title: `Тканина ${id}`,
      fabricInfo: null,
      prices: { retail: null, wholesale: null, large: 1000 + id },
      problem: null,
    },
  ],
});

const setupQuery = {
  data: {
    summer: { code: 'MOD-1', product: product(1), problem: null },
    winter: { code: 'MOD-5', product: product(5, 'Зима'), problem: null },
    letters: [
      { name: 'Запит на коротку відповідь', subject: 'Чи можемо бути корисними?' },
      { name: 'Після розмови', subject: 'Добірка спецодягу' },
    ],
  },
  isLoading: false,
  isError: false,
};

const api = vi.hoisted(() => ({
  create: vi.fn(),
  loadProducts: vi.fn(),
  mutation: (fn: (arg: unknown) => unknown) => () => [
    (arg: unknown) => ({ unwrap: () => fn(arg) }),
    { isLoading: false },
  ],
}));

vi.mock('@admin/quotes/data-access', () => ({
  toSaveQuoteIntroductionInput: (draft: unknown) => draft,
  useGetQuoteIntroductionSetupQuery: () => setupQuery,
  useGetQuoteQuery: () => ({ data: undefined, isLoading: false, isError: false }),
  useGetQuoteCatalogProductsQuery: () => ({ data: undefined }),
  useLazyGetQuoteCatalogProductsQuery: () => [
    (ids: unknown) => ({ unwrap: () => api.loadProducts(ids) }),
  ],
  useCreateQuoteIntroductionMutation: api.mutation(api.create),
  useSaveQuoteIntroductionMutation: api.mutation(vi.fn()),
  useDeleteQuoteMutation: api.mutation(vi.fn()),
  useSearchQuoteCatalogQuery: () => ({
    data: { items: [2, 3, 4].map((id) => product(id)), page: 1, pageSize: 20, total: 3 },
    isFetching: false,
    isError: false,
  }),
  useGetQuoteIntroTemplatesQuery: () => ({
    data: [
      {
        id: 7,
        name: 'Агро база',
        layout: 'Summer',
        letterName: 'Після розмови',
        pages: [
          {
            season: 'Summer',
            models: [1, 2, 3, 4].map((id) => ({
              productId: id,
              articleId: id * 100,
              productName: `Модель ${id}`,
              fabricTitle: `Тканина ${id}`,
            })),
          },
        ],
        author: { userId: 1, name: 'Директор' },
        createdAt: '2026-11-04T10:00:00Z',
        canDelete: false,
      },
    ],
    isLoading: false,
    isError: false,
  }),
  useDeleteQuoteIntroTemplateMutation: api.mutation(vi.fn()),
  useCreateQuoteIntroTemplateMutation: api.mutation(vi.fn()),
  downloadQuotePdf: vi.fn(),
  useGetQuoteSendDraftQuery: () => ({ data: undefined, isLoading: true, isError: false }),
  useSendQuoteMutation: api.mutation(vi.fn()),
  useConnectMailboxMutation: api.mutation(vi.fn()),
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/crm/quote-introductions/new']}>
      <Routes>
        <Route
          path="/crm/quote-introductions/new"
          element={<QuoteIntroductionPage actor={{ userId: 2, canSeeAll: false }} />}
        />
        <Route path="/crm/quote-introductions/:quoteId" element={<p>saved</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

const chooseFabric = (card: HTMLElement, title: string) => {
  fireEvent.mouseDown(within(card).getByRole('combobox'));
  fireEvent.click(screen.getByRole('option', { name: title }));
};

beforeEach(() => {
  api.create.mockReset();
  api.loadProducts.mockReset();
});
afterEach(cleanup);

describe('КП для знайомства', () => {
  it('builds a summer page from the main model and three picked models, then saves it', async () => {
    api.create.mockResolvedValue({
      id: 9,
      number: '2-11-2026',
      kind: 'Introduction',
      status: 'Draft',
      internalName: 'ТОВ «Агро»',
      customerId: null,
      recipientName: null,
      companyName: null,
      clientComment: null,
      managerNote: null,
      author: { userId: 2, name: 'Олена' },
      responsible: { userId: 2, name: 'Олена' },
      createdAt: '2026-11-04T10:00:00Z',
      updatedAt: '2026-11-04T10:00:00Z',
      lastSentAt: null,
      version: 1,
      items: [],
      introduction: { layout: 'Summer', recipientEmail: null, letterName: null },
    });
    renderPage();
    fireEvent.click(screen.getByRole('radio', { name: /Літній спецодяг/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти зміни' }));
    expect(await screen.findByText('Вкажіть клієнта або назву запиту.')).toBeVisible();
    expect(screen.getAllByText('Оберіть модель.')).toHaveLength(3);
    expect(api.create).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText('Клієнт або назва запиту'), {
      target: { value: 'ТОВ «Агро»' },
    });
    chooseFabric(
      screen.getByText('Головна модель · фіксована').closest('.MuiCard-root')!,
      'Тканина 1',
    );
    for (const id of [2, 3, 4]) {
      fireEvent.click(screen.getAllByRole('button', { name: /Обрати модель/ })[0]);
      fireEvent.click(
        await screen.findByRole('button', { name: `Обрати: Модель ${id}, Тканина ${id}` }),
      );
    }
    expect(screen.getByText('Модель 4')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Зберегти зміни' }));
    await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
    const draft = api.create.mock.calls[0][0] as QuoteIntroDraft;
    expect(draft.layout).toBe('Summer');
    expect(draft.pages[0].slots.map((slot) => [slot.productId, slot.articleId])).toEqual([
      [1, 100],
      [2, 200],
      [3, 300],
      [4, 400],
    ]);
    expect(await screen.findByText('saved')).toBeInTheDocument();
  });

  it('fills the selection from a ready template', async () => {
    api.loadProducts.mockResolvedValue([1, 2, 3, 4].map((id) => product(id)));
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Готові шаблони' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Застосувати' }));

    expect(await screen.findByText('Застосовано шаблон «Агро база».')).toBeVisible();
    expect(api.loadProducts).toHaveBeenCalledWith([1, 2, 3, 4]);
    expect(screen.getByRole('radio', { name: /Після розмови/ })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByText('Модель 3')).toBeVisible();
    expect(
      screen.queryByText('Зимовий спецодяг', { selector: 'h6, .MuiTypography-subtitle2' }),
    ).toBeNull();
  });
});
