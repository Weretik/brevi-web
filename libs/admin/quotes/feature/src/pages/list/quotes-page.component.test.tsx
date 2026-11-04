import { cleanup, render, screen } from '@testing-library/react';
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
      archivedAt: null,
    },
  ],
  page: 1,
  pageSize: 50,
  total: 1,
};

const staffQuery = vi.hoisted(() => vi.fn());
const listQuery = vi.hoisted(() => vi.fn());

vi.mock('@admin/quotes/data-access', () => ({
  useListQuotesQuery: (query: unknown) => {
    listQuery(query);
    return { data: page, isFetching: false, isError: false, refetch: vi.fn() };
  },
  useGetQuoteStaffQuery: staffQuery,
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
});

function renderList(canSeeAll: boolean) {
  staffQuery.mockReturnValue({ data: [{ userId: 2, name: 'Олена', email: null }] });
  return render(
    <MemoryRouter initialEntries={['/crm/quotes']}>
      <Routes>
        <Route path="/crm/quotes" element={<QuotesPage actor={{ userId: 2, canSeeAll }} />} />
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
  it('lists КП in work by default and the archive on its own tab', async () => {
    const user = userEvent.setup();
    renderList(false);
    expect(listQuery).toHaveBeenLastCalledWith(expect.objectContaining({ archived: false }));
    await user.click(screen.getByRole('tab', { name: 'Архів' }));
    expect(listQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ archived: true, page: 1 }),
    );
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

  it('«Нове КП» asks for the client, then opens the editor with it filled in', async () => {
    const user = userEvent.setup();
    renderList(false);
    await user.click(screen.getByRole('button', { name: 'Нове КП' }));
    const panel = screen.getByRole('dialog', { name: 'Нове КП' });
    expect(screen.getByRole('radio', { name: /КП під запит/ })).toBeChecked();
    expect(panel).not.toHaveTextContent('КП з нуля');

    await user.click(screen.getByRole('button', { name: 'Створити КП' }));
    expect(screen.getByText('Вкажіть клієнта або назву запиту.')).toBeVisible();

    await user.type(screen.getByRole('combobox', { name: /Клієнт або запит/ }), 'Агро');
    await user.click(await screen.findByRole('option', { name: /Агроресурс/ }));
    await user.click(screen.getByRole('button', { name: 'Створити КП' }));
    expect(
      screen.getByText(
        'request editor {"internalName":"Агроресурс","companyName":"ТОВ «Агроресурс»","recipientName":"Марина"}',
      ),
    ).toBeInTheDocument();
  });

  it('«Нове КП» opens «КП для знайомства» with a typed name', async () => {
    const user = userEvent.setup();
    renderList(false);
    await user.click(screen.getByRole('button', { name: 'Нове КП' }));
    await user.type(screen.getByRole('combobox', { name: /Клієнт або запит/ }), 'Новий клієнт');
    await user.click(screen.getByRole('radio', { name: /КП для знайомства/ }));
    await user.click(screen.getByRole('button', { name: 'Створити КП' }));
    expect(
      screen.getByText(
        'introduction editor {"internalName":"Новий клієнт","companyName":"","recipientName":""}',
      ),
    ).toBeInTheDocument();
  });
});
