import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import QuotesPage from './quotes-page';

const hooks = vi.hoisted(() => ({ list: vi.fn() }));
vi.mock('@admin/clients/data-access', () => ({
  useListQuotesQuery: hooks.list,
  useGetQuoteAssigneesQuery: () => ({
    currentData: { rows: [], totalPages: 1 },
    isFetching: false,
  }),
}));
describe('quote list route (SC-Q01/07)', () => {
  it('uses the shared list for archive and clears the source filter with pagination', () => {
    hooks.list.mockReturnValue({ currentData: { rows: [], totalPages: 0 }, isFetching: false });
    render(
      <MemoryRouter
        initialEntries={[
          '/crm/quotes/archive?page=2&sourceQuoteId=11111111-1111-4111-8111-111111111111',
        ]}
      >
        <QuotesPage archivedView />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Архів КП' })).toBeInTheDocument();
    expect(hooks.list.mock.calls.at(-1)?.[0]).toMatchObject({
      archived: true,
      page: 2,
      sourceQuoteId: '11111111-1111-4111-8111-111111111111',
    });
    fireEvent.click(screen.getByRole('button', { name: 'Прибрати фільтр копій' }));
    expect(hooks.list.mock.calls.at(-1)?.[0]).toEqual({
      search: '',
      state: undefined,
      archived: true,
      page: 1,
      pageSize: 25,
    });
  });
  it('applies explicit date filters through URL state and resets paging', () => {
    hooks.list.mockReturnValue({ currentData: { rows: [], totalPages: 0 }, isFetching: false });
    render(
      <MemoryRouter initialEntries={['/crm/quotes?page=3']}>
        <QuotesPage />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Додаткові фільтри' }));
    fireEvent.change(screen.getByLabelText('Створено від'), {
      target: { value: '2026-10-28T09:00' },
    });
    fireEvent.change(screen.getByLabelText('Створено до'), {
      target: { value: '2026-10-29T09:00' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Застосувати додаткові фільтри' }));
    expect(hooks.list.mock.calls.at(-1)?.[0]).toMatchObject({
      page: 1,
      createdFrom: new Date('2026-10-28T09:00').toISOString(),
      createdBefore: new Date('2026-10-29T09:00').toISOString(),
    });
  });
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
