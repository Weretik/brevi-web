import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import QuotesPage from './quotes-page';

import type { QuotePage } from '@admin/quotes/model';

const page: QuotePage = {
  items: [
    {
      id: 4,
      number: '1-11-2026',
      kind: 'Introduction',
      status: 'Draft',
      internalName: 'Агро база',
      companyName: 'ТОВ Агро',
      responsible: { userId: 2, name: 'Олена' },
      itemsCount: 3,
      updatedAt: '2026-11-04T10:00:00Z',
      lastSentAt: null,
      version: 3,
    },
  ],
  page: 1,
  pageSize: 50,
  total: 1,
};

const staffQuery = vi.hoisted(() => vi.fn());
const listQuery = vi.hoisted(() => vi.fn());
const legacyCount = vi.hoisted(() => ({ value: 0 }));
const purge = vi.hoisted(() => vi.fn());
const deleteQuote = vi.hoisted(() => vi.fn());

vi.mock('@admin/quotes/data-access', () => ({
  useListQuotesQuery: (query: unknown) => {
    listQuery(query);
    return { data: page, isFetching: false, isError: false, refetch: vi.fn() };
  },
  useGetQuoteStaffQuery: staffQuery,
  useGetQuoteLegacyArchiveQuery: () => ({ data: { count: legacyCount.value } }),
  usePurgeQuoteLegacyArchiveMutation: () => [purge, { isLoading: false }],
  useDeleteQuoteMutation: () => [deleteQuote, { isLoading: false }],
}));

vi.mock('@admin/clients/data-access', () => ({
  useListCustomersQuery: (_query: unknown, options: { skip: boolean }) => ({
    data: options.skip
      ? undefined
      : {
          rows: [
            {
              displayName: 'Агроресурс',
              legalName: 'ТОВ «Агроресурс»',
              contactName: 'Марина',
              kind: 'organization',
            },
          ],
        },
  }),
}));

function Opened({ name }: { name: string }) {
  const state = useLocation().state as { prefill?: unknown } | null;
  return <p>{`${name} ${JSON.stringify(state?.prefill ?? null)}`}</p>;
}

afterEach(() => {
  cleanup();
  staffQuery.mockReset();
  listQuery.mockReset();
  purge.mockReset();
  deleteQuote.mockReset();
  legacyCount.value = 0;
});

function renderList(canSeeAll: boolean, canDelete = false, state?: unknown) {
  staffQuery.mockReturnValue({ data: [{ userId: 2, name: 'Олена', email: null }] });
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/crm/quotes', state }]}>
      <Routes>
        <Route
          path="/crm/quotes"
          element={<QuotesPage actor={{ userId: 2, canSeeAll, canDelete }} />}
        />
        <Route path="/crm/quotes/new" element={<Opened name="request editor" />} />
        <Route
          path="/crm/quote-introductions/new"
          element={<Opened name="introduction editor" />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('КП list', () => {
  it('is «Комерційні пропозиції» without the archive tabs and confirms «КП збережено»', () => {
    renderList(false, false, { notice: 'КП збережено' });
    expect(screen.getByRole('heading', { name: 'Комерційні пропозиції' })).toBeVisible();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(listQuery).toHaveBeenLastCalledWith(expect.not.objectContaining({ archived: false }));
    expect(screen.getByText('КП збережено')).toBeVisible();
  });

  it('lets only the Director delete a КП from its row, and shows why the server refused', async () => {
    const user = userEvent.setup();
    renderList(true);
    expect(screen.queryByRole('button', { name: 'Видалити КП 1-11-2026' })).not.toBeInTheDocument();
    cleanup();

    deleteQuote.mockReturnValue({
      unwrap: () =>
        Promise.reject({ message: 'КП не можна видалити: за ним є виробниче завдання.' }),
    });
    renderList(true, true);
    await user.click(screen.getByRole('button', { name: 'Видалити КП 1-11-2026' }));
    const dialog = screen.getByRole('dialog', { name: 'Видалити КП 1-11-2026?' });
    await user.click(within(dialog).getByRole('button', { name: 'Видалити' }));
    expect(deleteQuote).toHaveBeenCalledWith({ id: 4, version: 3 });
    expect(
      await within(dialog).findByText('КП не можна видалити: за ним є виробниче завдання.'),
    ).toBeVisible();
  });

  it('shows the Director the КП left from the old archive and deletes them after a confirmation', async () => {
    const user = userEvent.setup();
    legacyCount.value = 12;
    purge.mockReturnValue({ unwrap: () => Promise.resolve({ deleted: 11, returned: 1 }) });
    renderList(true, true);
    expect(screen.getByText(/КП, які були в архіві: 12/)).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Видалити назавжди' }));
    const dialog = screen.getByRole('dialog', { name: 'Видалити КП з архіву: 12?' });
    await user.click(within(dialog).getByRole('button', { name: 'Видалити' }));
    expect(purge).toHaveBeenCalled();
    expect(
      await screen.findByText('Видалено КП: 11. Повернуто до списку (є виробниче завдання): 1.'),
    ).toBeVisible();
  });

  it('hides the old archive from who may not delete', () => {
    legacyCount.value = 12;
    renderList(true);
    expect(screen.queryByText(/КП, які були в архіві/)).not.toBeInTheDocument();
  });

  it('shows a Manager only their own КП without the responsible filter', () => {
    renderList(false);
    expect(screen.getByText('Ваші комерційні пропозиції')).toBeVisible();
    expect(screen.queryByLabelText('Відповідальний')).not.toBeInTheDocument();
    expect(staffQuery).toHaveBeenCalledWith(undefined, { skip: true });
    expect(screen.getByText('1-11-2026')).toBeInTheDocument();
    expect(screen.getByText('Для знайомства')).toBeInTheDocument();
  });

  it('gives Director and Admin the responsible filter', () => {
    renderList(true);
    expect(screen.getByText('Комерційні пропозиції всіх менеджерів')).toBeVisible();
    expect(screen.getByLabelText('Відповідальний')).toBeInTheDocument();
    expect(staffQuery).toHaveBeenCalledWith(undefined, { skip: false });
  });

  it('«Нове КП» opens the editor with the chosen client, or without one', async () => {
    const user = userEvent.setup();
    renderList(false);
    await user.click(screen.getByRole('button', { name: 'Нове КП' }));
    const panel = screen.getByRole('dialog', { name: 'Нове КП' });
    expect(screen.getByRole('radio', { name: /КП під запит/ })).toBeChecked();
    expect(panel).not.toHaveTextContent('КП з нуля');

    await user.type(screen.getByRole('combobox', { name: /Клієнт або запит/ }), 'Агро');
    await user.click(await screen.findByRole('option', { name: /Агроресурс/ }));
    await user.click(screen.getByRole('button', { name: 'Перейти до КП' }));
    expect(
      screen.getByText(
        'request editor {"internalName":"Агроресурс","companyName":"ТОВ «Агроресурс»","recipientName":"Марина"}',
      ),
    ).toBeInTheDocument();
    cleanup();

    renderList(false);
    await user.click(screen.getByRole('button', { name: 'Нове КП' }));
    await user.click(screen.getByRole('button', { name: 'Перейти до КП' }));
    expect(
      screen.getByText('request editor {"internalName":"","companyName":"","recipientName":""}'),
    ).toBeInTheDocument();
  });

  it('«Нове КП» opens «КП для знайомства» with a typed name', async () => {
    const user = userEvent.setup();
    renderList(false);
    await user.click(screen.getByRole('button', { name: 'Нове КП' }));
    await user.type(screen.getByRole('combobox', { name: /Клієнт або запит/ }), 'Новий клієнт');
    await user.click(screen.getByRole('radio', { name: /КП для знайомства/ }));
    await user.click(screen.getByRole('button', { name: 'Перейти до КП' }));
    expect(
      screen.getByText(
        'introduction editor {"internalName":"Новий клієнт","companyName":"","recipientName":""}',
      ),
    ).toBeInTheDocument();
  });
});
