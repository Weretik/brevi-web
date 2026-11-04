import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import QuoteEditorPage from './quote-editor-page';

import type { Quote, QuoteDraft } from '@admin/quotes/model';

const price = (amount: number) => ({ amount, source: amount, isManual: false, shown: true });

const quote: Quote = {
  id: 4,
  number: '1-11-2026',
  kind: 'Request',
  status: 'Draft',
  internalName: 'Агро база',
  customerId: null,
  recipientName: null,
  companyName: null,
  clientComment: null,
  managerNote: null,
  author: { userId: 2, name: 'Олена' },
  responsible: { userId: 2, name: 'Олена' },
  createdAt: '2026-11-04T10:00:00Z',
  updatedAt: '2026-11-04T10:00:00Z',
  version: 3,
  items: [
    {
      id: 10,
      kind: 'Ppe',
      productId: 7,
      code: 'Z-1',
      name: 'Рукавиці',
      subtitle: 'ЗІЗ · готовий товар',
      description: null,
      siteUrl: null,
      photoUrl: null,
      season: null,
      supplierUrl: null,
      options: [
        {
          id: 20,
          articleId: null,
          fabricId: null,
          title: 'Ціна',
          details: null,
          isRecommended: false,
          prices: { retail: price(100), wholesale: price(90), large: price(80) },
          manualReason: null,
          manualByName: null,
          manualAt: null,
          pricesTakenAt: null,
        },
      ],
    },
  ],
};

const api = vi.hoisted(() => ({
  save: vi.fn(),
  refetch: vi.fn(),
  mutation: (fn: (arg: unknown) => unknown) => () => [
    (arg: unknown) => ({ unwrap: () => fn(arg) }),
    { isLoading: false },
  ],
}));

vi.mock('@admin/quotes/data-access', () => ({
  useGetQuoteQuery: () => ({ data: quote, isLoading: false, isError: false, refetch: api.refetch }),
  useCreateQuoteMutation: api.mutation(vi.fn()),
  useSaveQuoteMutation: api.mutation(api.save),
  useDeleteQuoteMutation: api.mutation(vi.fn()),
}));
vi.mock('@admin/clients/data-access', () => ({
  useListCustomersQuery: () => ({ data: undefined }),
}));

function renderEditor() {
  return render(
    <MemoryRouter initialEntries={['/crm/quotes/4']}>
      <Routes>
        <Route
          path="/crm/quotes/:quoteId"
          element={<QuoteEditorPage actor={{ userId: 2, canSeeAll: false }} />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

const typeRetail = (value: string) =>
  fireEvent.change(screen.getByLabelText('Ціна: Рукавиці, Ціна, до 9 шт.'), {
    target: { value },
  });

beforeEach(() => {
  api.save.mockReset();
  api.refetch.mockReset();
});
afterEach(cleanup);

describe('КП editor', () => {
  it('asks a reason for a manual PPE price before saving', async () => {
    api.save.mockResolvedValue(quote);
    renderEditor();
    expect(await screen.findByText('КП 1-11-2026')).toBeVisible();

    typeRetail('95');
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти зміни' }));
    expect(await screen.findByText('Вкажіть причину ручної ціни.')).toBeVisible();
    expect(api.save).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText(/Причина ручної ціни/), {
      target: { value: 'Знижка' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти зміни' }));
    await waitFor(() => expect(api.save).toHaveBeenCalledTimes(1));
    const sent = api.save.mock.calls[0][0] as { id: number; draft: QuoteDraft };
    expect(sent.id).toBe(4);
    expect(sent.draft.items[0].options[0].prices.retail.manual).toBe('95');
  });

  it('hides a price from the client', async () => {
    api.save.mockResolvedValue(quote);
    renderEditor();
    fireEvent.click(await screen.findByLabelText('Показати в КП: Рукавиці, Ціна, до 9 шт.'));
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти зміни' }));
    await waitFor(() => expect(api.save).toHaveBeenCalledTimes(1));
    const sent = api.save.mock.calls[0][0] as { draft: QuoteDraft };
    expect(sent.draft.items[0].options[0].prices.retail.shown).toBe(false);
  });

  it('offers to reload when the КП was saved in another window', async () => {
    api.save.mockRejectedValue({
      status: 409,
      message: 'КП змінили в іншому вікні. Оновіть сторінку.',
    });
    api.refetch.mockResolvedValue({ data: quote });
    renderEditor();
    fireEvent.change(await screen.findByLabelText("Ім'я отримувача"), {
      target: { value: 'Петро' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти зміни' }));
    expect(await screen.findByText('КП змінили в іншому вікні. Оновіть сторінку.')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Оновити' }));
    await waitFor(() => expect(api.refetch).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByLabelText("Ім'я отримувача")).toHaveValue(''));
  });
});
