import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PurchaseInvoicesContent } from './purchase-invoices-content';

const fixture = vi.hoisted(() => ({
  queries: [] as Record<string, unknown>[],
  sync: vi.fn(),
  review: vi.fn(),
  syncError: null as string | null,
}));

const invoice = {
  messageId: 'm1',
  telegramKey: 'telegram:-100:7',
  sourceUid: '42',
  rowNumber: 5,
  sourceRowCount: 1,
  chatName: 'Бухгалтерія',
  fromUser: 'Олена',
  messageAt: '03.11.2026 10:15',
  text: 'Рахунок від ФОП Бистров',
  statusOriginal: 'СПЛАЧЕНО',
  markAt: '04.11.2026',
  markBy: 'Ірина',
  markedPaid: true,
  supplierId: null,
  supplierName: null,
  reviewNote: null,
  reviewVersion: 0,
  reviewedBy: null,
  reviewedAt: null,
  state: 'AwaitingRecognition',
  issues: [],
  links: [{ id: 'f1', url: 'https://www.dropbox.com/s/a.pdf', safe: true }],
};
const problem = {
  ...invoice,
  messageId: 'm2',
  sourceUid: '43',
  markedPaid: false,
  statusOriginal: '',
  markBy: null,
  markAt: null,
  state: 'NeedsReview',
  issues: ['Посилання не з Dropbox'],
  links: [{ id: 'f2', url: 'http://example.com/a.pdf', safe: false }],
};

vi.mock('@admin/purchasing/data-access', () => ({
  useGetPurchaseInvoicesQuery: (query: Record<string, unknown>) => {
    fixture.queries.push(query);
    const total = query['filter'] === 'All' ? 2 : 1;
    return {
      currentData: {
        items: query['pageSize'] === 1 ? [] : [invoice, problem],
        total,
        page: 1,
        pageSize: query['pageSize'],
      },
      isLoading: false,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    };
  },
  useGetPurchaseSyncStateQuery: () => ({
    currentData: {
      lastSuccessAt: '2026-11-05T07:00:00Z',
      lastAttemptAt: '2026-11-05T08:00:00Z',
      error: fixture.syncError,
      recordCount: 2,
      fileCount: 2,
    },
  }),
  useSyncPurchaseInvoicesMutation: () => [fixture.sync, { isLoading: false }],
  useGetPurchaseSuppliersQuery: () => ({
    currentData: [
      { id: 7, name: 'Текстиль-Контакт' },
      { id: 8, name: 'ФОП Бистров' },
    ],
    isFetching: false,
    error: undefined,
  }),
  useReviewPurchaseInvoiceMutation: () => [fixture.review, { isLoading: false }],
}));

afterEach(() => {
  cleanup();
  fixture.queries = [];
  fixture.sync.mockReset();
  fixture.review.mockReset();
  fixture.syncError = null;
});

function renderContent(url = '/references/counterparties?tab=purchases') {
  const router = createMemoryRouter(
    [{ path: '/references/counterparties', element: <PurchaseInvoicesContent /> }],
    { initialEntries: [url] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

describe('«Контрагенти → Рахунки на закупку»', () => {
  it('shows a card per message and marks only problems', async () => {
    renderContent();

    const grid = await screen.findByRole('grid', { name: 'Рахунки на закупку' });
    expect(within(grid).getAllByText('Рахунок від ФОП Бистров')).toHaveLength(2);
    expect(within(grid).getByRole('link', { name: 'Оригінал ↗' })).toHaveAttribute(
      'href',
      'https://www.dropbox.com/s/a.pdf',
    );
    expect(within(grid).getByText('Посилання потребує перевірки')).toBeVisible();
    expect(within(grid).getByText('Відмічено в джерелі')).toBeVisible();
    expect(within(grid).getByText('Не підтверджено')).toBeVisible();
    expect(within(grid).getByText('Посилання не з Dropbox')).toBeVisible();
    expect(screen.queryByText(/Готово|Перевірено|Актуальн/)).not.toBeInTheDocument();
  });

  it('keeps the problems filter and search in the URL', async () => {
    const user = userEvent.setup();
    const router = renderContent();

    await user.click(screen.getByRole('button', { name: 'Потребують перевірки 1' }));
    expect(router.state.location.search).toContain('filter=NeedsReview');

    await user.type(screen.getByRole('textbox', { name: 'Пошук рахунків' }), 'Бистров');
    await waitFor(() => expect(router.state.location.search).toContain('search=%D0%91'));
    expect(fixture.queries).toContainEqual({
      filter: 'NeedsReview',
      search: 'Бистров',
      page: 1,
      pageSize: 50,
    });
  });

  it('runs «Оновити зараз» and shows the backend reason when it fails', async () => {
    const user = userEvent.setup();
    fixture.sync.mockReturnValue({
      unwrap: () =>
        Promise.reject({
          code: 'Unavailable',
          status: 503,
          message: 'Відкрийте доступ до таблиці.',
          fieldErrors: {},
        }),
    });
    renderContent();

    await user.click(screen.getByRole('button', { name: 'Оновити зараз' }));
    expect(fixture.sync).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('Відкрийте доступ до таблиці.')).toBeVisible();
  });

  it('shows the reason of the last failed sync', () => {
    fixture.syncError = 'Заголовок таблиці змінився.';
    renderContent();

    expect(screen.getByText(/не вдалося: Заголовок таблиці змінився\./)).toBeVisible();
  });
  it('opens a row in the side panel and links a supplier with a note', async () => {
    const user = userEvent.setup();
    fixture.review.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          messageId: 'm1',
          supplierId: 8,
          supplierName: 'ФОП Бистров',
          reviewNote: 'Березень',
          reviewVersion: 1,
          reviewedBy: 'buh@brevi.com.ua',
          reviewedAt: '2026-11-05T08:00:00Z',
        }),
    });
    renderContent();

    const grid = await screen.findByRole('grid', { name: 'Рахунки на закупку' });
    await user.click(within(grid).getByText('UID 42'));
    const panel = screen.getByRole('dialog', { name: 'Рахунок на закупку' });
    expect(within(panel).getByText('Відмічено в джерелі · Ірина · 04.11.2026')).toBeVisible();

    await user.click(within(panel).getByRole('button', { name: 'Редагувати' }));
    const form = screen.getByRole('dialog', { name: 'Постачальник і примітка' });
    await user.click(within(form).getByRole('combobox', { name: 'Постачальник' }));
    await user.click(await screen.findByRole('option', { name: 'ФОП Бистров' }));
    await user.type(within(form).getByRole('textbox', { name: 'Примітка' }), '  Березень ');
    await user.click(within(form).getByRole('button', { name: 'Зберегти' }));

    expect(fixture.review).toHaveBeenCalledWith({
      messageId: 'm1',
      supplierId: 8,
      note: 'Березень',
      version: 0,
    });
    expect(await screen.findByText('Збережено: постачальник «ФОП Бистров».')).toBeVisible();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('keeps the panel open with the reason when someone saved first', async () => {
    const user = userEvent.setup();
    fixture.review.mockReturnValue({
      unwrap: () =>
        Promise.reject({
          code: 'Conflict',
          status: 409,
          message: 'Цей рахунок уже змінили. Відкрийте його знову, щоб побачити нові дані.',
          fieldErrors: {},
        }),
    });
    renderContent();

    const grid = await screen.findByRole('grid', { name: 'Рахунки на закупку' });
    await user.click(within(grid).getByText('UID 42'));
    await user.click(screen.getByRole('button', { name: 'Редагувати' }));
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(await screen.findByText(/Цей рахунок уже змінили/)).toBeVisible();
    expect(screen.getByRole('dialog', { name: 'Постачальник і примітка' })).toBeVisible();
  });

  it('offers the «Без постачальника» filter', async () => {
    const user = userEvent.setup();
    const router = renderContent();

    await user.click(screen.getByRole('button', { name: 'Без постачальника 1' }));
    expect(router.state.location.search).toContain('filter=WithoutSupplier');
  });
});
