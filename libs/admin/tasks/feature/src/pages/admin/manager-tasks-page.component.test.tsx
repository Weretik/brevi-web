import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ManagerTasksPage from './manager-tasks-page';

import type { TaskOverview } from '@admin/tasks/model';

const overview: TaskOverview = {
  open: 5,
  overdue: 2,
  urgent: 1,
  new: 1,
  inProgress: 3,
  done: 4,
  doneLastWeek: 2,
  onTimePercent: 75,
  load: [
    {
      userId: 5,
      name: 'Анастасія Берегових',
      open: 3,
      overdue: 2,
      urgent: 1,
      inProgress: 1,
      doneLastWeek: 2,
      onTimePercent: 75,
    },
    {
      userId: 6,
      name: 'Вадим Ковальчук',
      open: 0,
      overdue: 0,
      urgent: 0,
      inProgress: 0,
      doneLastWeek: 0,
      onTimePercent: null,
    },
  ],
};

const listQuery = vi.hoisted(() => vi.fn());
const idle = vi.hoisted(() => () => [vi.fn(), { isLoading: false }]);

vi.mock('@admin/tasks/data-access', () => ({
  useListTasksQuery: listQuery,
  useGetTaskOverviewQuery: () => ({ data: overview, isFetching: false, refetch: vi.fn() }),
  useGetTaskAssigneesQuery: () => ({ data: [] }),
  useGetTaskQuery: () => ({ data: undefined, isFetching: false, isError: false }),
  useCreateTaskMutation: idle,
  useEditTaskMutation: idle,
  useChangeTaskStatusMutation: idle,
  useMarkTaskStepMutation: idle,
  useDeleteTaskMutation: idle,
}));

vi.mock('@admin/clients/data-access', () => ({
  useListCustomersQuery: () => ({ data: undefined }),
}));

afterEach(() => {
  cleanup();
  listQuery.mockReset();
});

describe('«Завдання менеджерам»', () => {
  it('shows every manager on «Навантаження» and opens their tasks on a click', () => {
    listQuery.mockReturnValue({
      data: { items: [], total: 0 },
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });
    render(<ManagerTasksPage viewer={{ userId: 1, isAdmin: true }} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Навантаження' }));
    const table = screen.getByRole('table', { name: 'Навантаження менеджерів' });
    expect(within(table).getByText('75%')).toBeInTheDocument();
    expect(within(table).getByText('—')).toBeInTheDocument();

    fireEvent.click(within(table).getByRole('row', { name: /Анастасія Берегових/ }));
    expect(screen.getByRole('tab', { name: 'Завдання' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Менеджер: Анастасія Берегових')).toBeInTheDocument();
    expect(listQuery).toHaveBeenLastCalledWith(expect.objectContaining({ assigneeUserId: 5 }));
  });
});
