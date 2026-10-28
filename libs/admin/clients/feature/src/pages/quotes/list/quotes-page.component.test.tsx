import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import QuotesPage from './quotes-page';

const hooks = vi.hoisted(() => ({ list: vi.fn() }));
vi.mock('@admin/clients/data-access', () => ({ useListQuotesQuery: hooks.list }));
describe('quote list route (SC-Q01/07)', () => {
  afterEach(cleanup);
  it('shows an empty scoped list and resets page when searching', () => {
    hooks.list.mockReturnValue({
      currentData: { rows: [], page: 3, pageSize: 25, total: 0, totalPages: 0 },
      isFetching: false,
    });
    render(
      <MemoryRouter initialEntries={['/crm/quotes?page=3']}>
        <QuotesPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('КП за цими умовами не знайдено.')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'Пошук КП' }), {
      target: { value: ' Synthetic ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Знайти КП' }));
    expect(hooks.list).toHaveBeenLastCalledWith({
      search: 'Synthetic',
      state: undefined,
      archived: false,
      page: 1,
      pageSize: 25,
    });
  });
  it('shows a permission error and disables creation without exposing cached rows', () => {
    hooks.list.mockReturnValue({
      currentData: undefined,
      error: { code: 'Forbidden', status: 403, message: 'Forbidden', fieldErrors: {} },
      refetch: vi.fn(),
    });
    render(
      <MemoryRouter>
        <QuotesPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('У вас немає доступу до цієї дії.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Створити КП' })).toBeDisabled();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
