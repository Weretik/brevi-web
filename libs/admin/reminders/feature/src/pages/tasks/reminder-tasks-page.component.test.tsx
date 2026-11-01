import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ReminderTasksPage from './reminder-tasks-page';

import type { ReminderTask } from '@admin/reminders/model';

const task = (
  id: number,
  organization: ReminderTask['organization'],
  title: string,
): ReminderTask => ({
  id,
  title,
  organization,
  schedule: { periodicity: 'monthly', dueRule: 'dayOfMonth', day: 20, monthOffset: 0, leadDays: 5 },
  chatId: null,
  chatName: null,
  activeFrom: '2026-11-01',
  isEnabled: true,
  nextDueDates: [{ period: 'листопад 2026', dueDate: '2026-11-20', remindFrom: '2026-11-15' }],
});

const api = vi.hoisted(() => ({ create: vi.fn() }));
vi.mock('@admin/reminders/data-access', () => ({
  useGetReminderTasksQuery: () => ({
    currentData: [task(1, 'ppBrevi', 'ЄСВ за працівників'), task(2, 'none', 'Комуналка')],
    isLoading: false,
    isFetching: false,
    refetch: vi.fn(),
  }),
  useGetReminderChatsQuery: () => ({ currentData: [] }),
  usePreviewReminderDueDatesQuery: () => ({ currentData: [], isFetching: false }),
  useCreateReminderTaskMutation: () => [api.create, { isLoading: false }],
  useUpdateReminderTaskMutation: () => [vi.fn(), { isLoading: false }],
  useArchiveReminderTaskMutation: () => [vi.fn(), { isLoading: false }],
}));

afterEach(() => {
  cleanup();
  api.create.mockReset();
});

describe('ReminderTasksPage', () => {
  it('shows tasks, warns about tasks without a chat and filters by organization', () => {
    render(<ReminderTasksPage />);
    expect(screen.getByRole('heading', { name: 'Задачі' })).toBeInTheDocument();
    expect(screen.getByText('2 задач · 2 без чату, вони не надсилаються')).toBeInTheDocument();
    expect(screen.getByText('Комуналка')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'ПП «Бреві» 1' }));
    expect(screen.queryByText('Комуналка')).not.toBeInTheDocument();
    expect(screen.getByText('ЄСВ за працівників')).toBeInTheDocument();
  });

  it('validates and creates a task', async () => {
    api.create.mockReturnValue({ unwrap: () => Promise.resolve(task(3, 'ppBrevi', 'Нова')) });
    render(<ReminderTasksPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Нова задача' }));
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Створити' }));
    expect(within(dialog).getByText('Вкажіть назву задачі.')).toBeInTheDocument();
    expect(api.create).not.toHaveBeenCalled();

    fireEvent.change(within(dialog).getByRole('textbox', { name: 'Назва задачі' }), {
      target: { value: 'Податок на землю' },
    });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Створити' }));
    await waitFor(() => expect(screen.getByText('Задачу створено.')).toBeInTheDocument());
    expect(api.create).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Податок на землю', organization: 'ppBrevi' }),
    );
  });
});
