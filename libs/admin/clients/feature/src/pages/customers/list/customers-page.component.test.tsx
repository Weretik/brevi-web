import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import CustomersPage from './customers-page';

const hooks = vi.hoisted(() => ({ list: vi.fn() }));
vi.mock('@admin/clients/data-access', () => ({ useListCustomersQuery: hooks.list }));
const empty = { rows: [], page: 1, pageSize: 25, total: 0, totalPages: 0 };
describe('existing clients route states', () => {
  afterEach(cleanup);
  beforeEach(() => {
    hooks.list.mockReset();
  });
  it('shows loading and disables create until scoped access is known', () => {
    hooks.list.mockReturnValue({ isLoading: true, isFetching: true, currentData: undefined });
    render(
      <MemoryRouter>
        <CustomersPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('progressbar', { name: 'Завантаження клієнтів' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Створити клієнта' })).toBeDisabled();
  });
  it('distinguishes an empty list from a transport failure', () => {
    hooks.list.mockReturnValue({ isLoading: false, currentData: empty });
    render(
      <MemoryRouter>
        <CustomersPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Клієнтів за цими умовами не знайдено.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Створити клієнта' })).toBeEnabled();
  });
  it('shows forbidden state without data or create action', () => {
    hooks.list.mockReturnValue({
      isLoading: false,
      error: { code: 'Forbidden', status: 403, message: 'forbidden', fieldErrors: {} },
      refetch: vi.fn(),
    });
    render(
      <MemoryRouter>
        <CustomersPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('У вас немає доступу до цієї дії.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Створити клієнта' })).toBeDisabled();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
  it('submits bounded search through URL state and resets pagination', () => {
    hooks.list.mockReturnValue({ isLoading: false, currentData: empty });
    render(
      <MemoryRouter initialEntries={['/crm/clients?page=3']}>
        <CustomersPage />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByRole('textbox', { name: 'Пошук клієнтів' }), {
      target: { value: ' Synthetic ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Знайти' }));
    expect(hooks.list).toHaveBeenLastCalledWith({
      search: 'Synthetic',
      active: true,
      page: 1,
      pageSize: 25,
    });
  });
});
