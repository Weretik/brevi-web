import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ReminderOccurrencesPage from './reminder-occurrences-page';

import type { ReminderOccurrence } from '@admin/reminders/model';

const overdue: ReminderOccurrence = {
  id: 9,
  taskId: 1,
  taskTitle: 'ЄСВ за працівників',
  organization: 'ppBrevi',
  period: 'жовтень 2026',
  dueDate: '2020-01-20',
  remindFrom: '2020-01-15',
  status: 'open',
  snoozedUntil: null,
  closedBy: null,
  closedAt: null,
  actions: [],
};

const api = vi.hoisted(() => ({ close: vi.fn(), queries: [] as unknown[] }));
vi.mock('@admin/reminders/data-access', () => ({
  useGetReminderOccurrencesQuery: (query: unknown) => {
    api.queries.push(query);
    return {
      currentData: { items: [overdue], total: 1 },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    };
  },
  useCloseReminderOccurrenceMutation: () => [api.close],
  useReopenReminderOccurrenceMutation: () => [vi.fn()],
}));

afterEach(() => {
  cleanup();
  api.close.mockReset();
  api.queries = [];
});

describe('ReminderOccurrencesPage', () => {
  it('shows overdue periods and lets the admin close one', async () => {
    api.close.mockReturnValue({ unwrap: () => Promise.resolve({ ...overdue, status: 'done' }) });
    render(
      <MemoryRouter initialEntries={['/reminders/periods']}>
        <ReminderOccurrencesPage />
      </MemoryRouter>,
    );
    expect(api.queries).toContainEqual({ status: 'open', page: 1, pageSize: 50 });
    expect(screen.getAllByText('Прострочено').length).toBeGreaterThan(0);
    expect(screen.getByText('потребують уваги')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Виконано' }));
    await waitFor(() =>
      expect(
        screen.getByText('«ЄСВ за працівників» за жовтень 2026 позначено виконаним.'),
      ).toBeInTheDocument(),
    );
    expect(api.close).toHaveBeenCalledWith(9);
  });
});
