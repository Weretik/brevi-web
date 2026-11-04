import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
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
    },
  ],
  page: 1,
  pageSize: 50,
  total: 1,
};

const staffQuery = vi.hoisted(() => vi.fn());

vi.mock('@admin/quotes/data-access', () => ({
  useListQuotesQuery: () => ({ data: page, isFetching: false, isError: false, refetch: vi.fn() }),
  useGetQuoteStaffQuery: staffQuery,
}));

afterEach(() => {
  cleanup();
  staffQuery.mockReset();
});

function renderList(canSeeAll: boolean) {
  staffQuery.mockReturnValue({ data: [{ userId: 2, name: 'Олена', email: null }] });
  return render(
    <MemoryRouter initialEntries={['/crm/quotes']}>
      <Routes>
        <Route path="/crm/quotes" element={<QuotesPage actor={{ userId: 2, canSeeAll }} />} />
        <Route path="/crm/quotes/new" element={<p>request editor</p>} />
        <Route path="/crm/quote-introductions/new" element={<p>introduction editor</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('КП list', () => {
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

  it('«Нове КП» offers both kinds and opens the chosen editor', async () => {
    const user = userEvent.setup();
    renderList(false);
    await user.click(screen.getByRole('button', { name: 'Нове КП' }));
    expect(screen.getByRole('menuitem', { name: /КП під запит/ })).toBeVisible();
    await user.click(screen.getByRole('menuitem', { name: /КП для знайомства/ }));
    expect(screen.getByText('introduction editor')).toBeInTheDocument();
  });
});
