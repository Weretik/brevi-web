import { QuotePrices } from '@admin/clients/ui';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { QuoteEditorForm } from './quote-editor-form';

import type { QuoteDetail } from '@admin/clients/model';

const api = vi.hoisted(() => ({ create: vi.fn(), save: vi.fn(), preview: vi.fn() }));
vi.mock('../lifecycle/quote-lifecycle-panel', () => ({ QuoteLifecyclePanel: () => null }));
vi.mock('../../documents/quote-documents-panel', () => ({ QuoteDocumentsPanel: () => null }));
vi.mock('@admin/clients/data-access', () => ({
  useCreateQuoteMutation: () => [api.create],
  useSaveQuoteVersionMutation: () => [api.save],
  usePreviewQuotePricesMutation: () => [api.preview],
  useListCustomersQuery: () => ({ currentData: { rows: [] }, isFetching: false }),
  useGetCustomerQuery: () => ({ currentData: undefined }),
}));
vi.mock('@admin/products/data-access', () => ({
  useListProductsQuery: () => ({
    currentData: { value: [], pagedInfo: { totalPages: 0 } },
    isFetching: false,
  }),
  useListSewingArticlesQuery: () => ({ currentData: { articles: [] }, isFetching: false }),
}));
const detail: QuoteDetail = {
  publicId: 'quote',
  versionId: 'version',
  sourceQuoteId: null,
  sourceVersionId: null,
  revision: 1,
  versionNumber: 1,
  state: 'draft',
  archived: false,
  number: null,
  ownerId: 17,
  versionActorId: 17,
  updatedAt: '2026-10-27T12:00:00Z',
  canEdit: true,
  draft: {
    customerId: null,
    contactId: null,
    recipientName: 'Одержувач',
    items: [
      {
        key: 'item',
        publicId: 'item',
        title: 'Позиція',
        included: true,
        publicDescription: 'Збережений опис',
        publicComment: '',
        internalNote: 'Приватно',
        variants: [
          {
            key: 'variant',
            publicId: 'variant',
            title: 'Рукавиці',
            visible: true,
            selection: { kind: 'ppe', productId: 42 },
            tierVisibility: { retail: true, wholesale: false, largeWholesale: true },
            basis: {
              origin: 'saved',
              value: {
                token: 'historical',
                expiresAt: 0,
                selection: { kind: 'ppe', productId: 42 },
                retail: 120,
                wholesale: 100,
                largeWholesale: 80,
                blockers: [],
                currency: 'UAH',
                taxBasis: 'catalog_no_extra_vat',
              },
            },
          },
        ],
      },
    ],
  },
};
function show(initial: QuoteDetail | null = detail, reload = vi.fn(async () => detail)) {
  return render(
    <RouterProvider
      router={createMemoryRouter(
        [{ path: '*', element: <QuoteEditorForm initial={initial} reload={reload} /> }],
        { initialEntries: ['/crm/quotes/quote'] },
      )}
    />,
  );
}
describe('quote draft interactions (SC-Q01/02/04/07)', () => {
  it('blocks every form submit when access has failed, including implicit submission', () => {
    api.save.mockReturnValue({ unwrap: async () => detail });
    render(
      <RouterProvider
        router={createMemoryRouter(
          [{ path: '*', element: <QuoteEditorForm initial={detail} accessError /> }],
          { initialEntries: ['/crm/quotes/quote'] },
        )}
      />,
    );
    const form = screen.getByRole('textbox', { name: 'Опис для клієнта' }).closest('form');
    fireEvent.submit(form!);
    expect(api.save).not.toHaveBeenCalled();
  });
  beforeEach(() => {
    api.create.mockReset();
    api.save.mockReset();
    api.preview.mockReset();
  });
  afterEach(cleanup);

  it('saves and reopens edited text and frozen prices without repricing', async () => {
    let saved = detail;
    api.save.mockImplementation((args) => ({
      unwrap: async () => {
        saved = { ...detail, revision: 2, versionNumber: 2, draft: args.draft };
        return saved;
      },
    }));
    const first = show();
    fireEvent.change(screen.getByRole('textbox', { name: 'Опис для клієнта' }), {
      target: { value: 'Новий опис' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти чернетку' }));
    expect(await screen.findByText(/КП збережено. Серверна версія 2/)).toBeInTheDocument();
    expect(api.preview).not.toHaveBeenCalled();
    first.unmount();
    show(saved);
    expect(screen.getByRole('textbox', { name: 'Опис для клієнта' })).toHaveValue('Новий опис');
    expect(screen.getByLabelText(/Роздріб:.*120/)).toBeChecked();
    expect(screen.getByLabelText(/Опт:.*100/)).not.toBeChecked();
  });

  it('retains dirty text after conflict and reloads only after explicit discard', async () => {
    api.save.mockReturnValue({
      unwrap: () =>
        Promise.reject({ code: 'Conflict', status: 409, message: 'Conflict', fieldErrors: {} }),
    });
    const reload = vi.fn(async () => ({ ...detail, revision: 2, versionNumber: 2 }));
    show(detail, reload);
    fireEvent.change(screen.getByRole('textbox', { name: 'Опис для клієнта' }), {
      target: { value: 'Не втратити' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти чернетку' }));
    expect(await screen.findByText(/КП або джерело ціни змінилися/)).toBeInTheDocument();
    expect(await screen.findByRole('textbox', { name: 'Опис для клієнта' })).toHaveValue(
      'Не втратити',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Оновити дані із сервера' }));
    expect(reload).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Продовжити редагування' }));
    expect(await screen.findByRole('textbox', { name: 'Опис для клієнта' })).toHaveValue(
      'Не втратити',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Оновити дані із сервера' }));
    fireEvent.click(screen.getByRole('button', { name: 'Відхилити й оновити' }));
    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: 'Опис для клієнта' })).toHaveValue(
        'Збережений опис',
      ),
    );
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('disables editing while the outcome of a timed-out save is being resolved', async () => {
    api.save.mockReturnValue({
      unwrap: () =>
        Promise.reject({ code: 'Timeout', status: 0, message: 'Timeout', fieldErrors: {} }),
    });
    show();
    fireEvent.change(screen.getByRole('textbox', { name: 'Опис для клієнта' }), {
      target: { value: 'Повторити точно' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти чернетку' }));
    expect(
      await screen.findByRole('button', { name: 'Перевірити результат повтором' }),
    ).toBeEnabled();
    expect(screen.getByRole('textbox', { name: 'Опис для клієнта' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Перевірити результат повтором' }));
    await waitFor(() => expect(api.save).toHaveBeenCalledTimes(2));
    expect(api.save.mock.calls[1][0]).toEqual(api.save.mock.calls[0][0]);
  });

  it('renders a read-only snapshot without a save action', () => {
    show({ ...detail, canEdit: false });
    expect(screen.getByRole('textbox', { name: 'Опис для клієнта' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Зберегти чернетку' })).not.toBeInTheDocument();
  });

  it('creates one-off PPE only after a reason and a successful server preview', async () => {
    api.preview.mockImplementation((args) => ({
      unwrap: async () => ({
        token: 'server-token',
        expiresAt: Date.now() + 900000,
        selection: args.selection,
        retail: 250,
        wholesale: 225,
        largeWholesale: 200,
        blockers: [],
        currency: 'UAH',
        taxBasis: 'manual_no_extra_vat',
      }),
    }));
    api.create.mockImplementation((args) => ({
      unwrap: async () => ({ ...detail, draft: args.draft }),
    }));
    show(null);
    fireEvent.change(screen.getByRole('textbox', { name: 'Одержувач КП' }), {
      target: { value: 'Новий одержувач' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Додати позицію' }));
    fireEvent.click(screen.getByRole('button', { name: 'Додати варіант' }));
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Тип варіанта' }));
    fireEvent.click(screen.getByRole('option', { name: 'Разові СІЗ' }));
    fireEvent.change(await screen.findByRole('spinbutton', { name: 'Роздріб, грн' }), {
      target: { value: '250' },
    });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Опт, грн' }), {
      target: { value: '225' },
    });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Великий опт, грн' }), {
      target: { value: '200' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Розрахувати вибір' }));
    expect(api.preview).not.toHaveBeenCalled();
    fireEvent.change(screen.getByRole('textbox', { name: /Підстава ручних цін/ }), {
      target: { value: 'Разове замовлення' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Розрахувати вибір' }));
    expect(await screen.findByLabelText(/Роздріб:.*250/)).toBeChecked();
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти чернетку' }));
    await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
    expect(api.create.mock.calls[0][0].draft.items[0].variants[0]).toMatchObject({
      selection: {
        kind: 'oneOffPpe',
        prices: { retail: 250, wholesale: 225, largeWholesale: 200, reason: 'Разове замовлення' },
      },
      basis: { origin: 'preview', value: { token: 'server-token' } },
    });
  });

  it('shows missing and hidden prices without fabricating a zero price', () => {
    const original = detail.draft.items[0].variants[0];
    render(
      <QuotePrices
        variant={{
          ...original,
          tierVisibility: { retail: false, wholesale: false, largeWholesale: false },
          basis: {
            origin: 'saved',
            value: {
              ...original.basis!.value,
              retail: null,
              wholesale: null,
              largeWholesale: null,
              blockers: ['MissingOffer'],
            },
          },
        }}
        disabled={false}
        now={100}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('Роздріб: ціна недоступна')).not.toBeChecked();
    expect(screen.getByText(/Усі ціни приховано/)).toBeInTheDocument();
    expect(screen.getByText(/Немає пропозиції постачальника/)).toBeInTheDocument();
    expect(screen.queryByText(/0,00/)).not.toBeInTheDocument();
  });
});
