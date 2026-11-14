import { PageRightsProvider } from '@admin/shared/ui';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BackgroundTasksPage } from './background-tasks-page';

import type { ScheduledTask } from '@admin/scheduling/model';

const fixture = vi.hoisted(() => ({
  tasks: [] as unknown[],
  error: undefined as unknown,
  loading: false,
  refetch: vi.fn(),
  update: vi.fn(),
  runNow: vi.fn(),
  mutation: (fn: (arg: unknown) => unknown) => () => [
    (arg: unknown) => ({ unwrap: () => fn(arg) }),
    { isLoading: false },
  ],
}));

vi.mock('@admin/scheduling/data-access', () => ({
  useGetScheduledTasksQuery: () => ({
    data: fixture.tasks,
    isLoading: fixture.loading,
    error: fixture.error,
    refetch: fixture.refetch,
  }),
  useGetScheduledTaskRunsQuery: () => ({
    data: [
      {
        id: 'run-1',
        trigger: 'manual',
        requestedBy: 'director@brevi',
        claimedAt: '2026-11-14T07:00:00Z',
        startedAt: '2026-11-14T07:00:10Z',
        finishedAt: '2026-11-14T07:01:00Z',
        outcome: 'succeeded',
        message: 'Додано 3 ліди',
      },
    ],
    isLoading: false,
    error: undefined,
  }),
  useUpdateScheduledTaskScheduleMutation: fixture.mutation((arg) => fixture.update(arg)),
  useRunScheduledTaskNowMutation: fixture.mutation((arg) => fixture.runNow(arg)),
}));

const leads: ScheduledTask = {
  key: 'leads',
  name: 'Ліди з Google-таблиці',
  description: 'Забирає нові заявки з таблиці сайту.',
  editable: true,
  enabled: true,
  schedule: {
    kind: 'daily',
    everyMinutes: null,
    fromHour: null,
    toHour: null,
    times: ['09:00'],
    days: [1, 2, 3, 4, 5],
  },
  nextRunAt: '2026-11-16T07:00:00Z',
  isRunning: false,
  runningSince: null,
  runRequestedAt: null,
  lastSuccessAt: '2026-11-13T07:01:00Z',
  lastSuccessSummary: 'Додано 3 ліди',
  lastFailureAt: '2026-11-12T07:01:00Z',
  lastFailureReason: 'Google недоступний',
  lastRunFailed: false,
  overdue: false,
};

const outbox: ScheduledTask = {
  ...leads,
  key: 'outbox',
  name: 'Повідомлення в Telegram',
  description: 'Надсилає чергу повідомлень.',
  editable: false,
  schedule: {
    kind: 'interval',
    everyMinutes: 1,
    fromHour: null,
    toHour: null,
    times: [],
    days: [],
  },
  lastFailureAt: '2026-11-14T06:00:00Z',
  lastRunFailed: true,
};

function renderPage(allowed: string[] = ['create', 'edit', 'delete']) {
  return render(
    <PageRightsProvider can={(action) => allowed.includes(action)}>
      <BackgroundTasksPage />
    </PageRightsProvider>,
  );
}

async function openRow(name: string) {
  await userEvent.click(await screen.findByText(name));
  return screen.findByRole('dialog');
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  fixture.tasks = [];
  fixture.error = undefined;
  fixture.loading = false;
});

describe('BackgroundTasksPage', () => {
  it('lists tasks with the schedule in words and marks only problems (SC-01)', async () => {
    fixture.tasks = [leads, outbox];
    renderPage();

    const grid = await screen.findByRole('grid', { name: 'Фонові задачі' });
    expect(within(grid).getByText('Пн–Пт о 09:00')).toBeInTheDocument();
    expect(within(grid).getByText('Щохвилини')).toBeInTheDocument();
    expect(within(grid).getAllByText('Остання спроба з помилкою')).toHaveLength(1);
    expect(screen.queryByText(/все добре/i)).not.toBeInTheDocument();
  });

  it('opens the panel with description, results and history (SC-02)', async () => {
    fixture.tasks = [leads];
    renderPage();

    const panel = await openRow('Ліди з Google-таблиці');
    expect(within(panel).getByText('Забирає нові заявки з таблиці сайту.')).toBeInTheDocument();
    expect(within(panel).getByText('Google недоступний')).toBeInTheDocument();
    expect(within(panel).getAllByText('Додано 3 ліди').length).toBeGreaterThan(0);
  });

  it('saves a new daily schedule (SC-03)', async () => {
    fixture.tasks = [leads];
    fixture.update.mockResolvedValue(leads);
    renderPage();

    const panel = await openRow('Ліди з Google-таблиці');
    await userEvent.click(within(panel).getByRole('button', { name: 'Змінити розклад' }));
    const days = within(panel).getByRole('group', { name: 'Дні тижня' });
    for (const day of ['Вт', 'Ср', 'Чт']) await userEvent.click(within(days).getByText(day));
    const first = within(panel).getByLabelText('Час 1');
    await userEvent.clear(first);
    await userEvent.type(first, '07:00');
    await userEvent.click(within(panel).getByRole('button', { name: 'Додати час' }));
    const second = within(panel).getByLabelText('Час 2');
    await userEvent.clear(second);
    await userEvent.type(second, '13:00');
    await userEvent.click(within(panel).getByRole('button', { name: 'Зберегти' }));

    await waitFor(() =>
      expect(fixture.update).toHaveBeenCalledWith({
        key: 'leads',
        input: expect.objectContaining({
          enabled: true,
          nextRunAt: null,
          schedule: expect.objectContaining({
            kind: 'daily',
            times: ['07:00', '13:00'],
            days: [1, 5],
          }),
        }),
      }),
    );
    expect(await screen.findByText('Розклад збережено.')).toBeInTheDocument();
  });

  it('runs a task now and shows the backend reason on refusal (SC-05)', async () => {
    fixture.tasks = [leads];
    fixture.runNow.mockResolvedValueOnce(undefined).mockRejectedValueOnce({
      status: 409,
      data: { title: 'Задача вже виконується.' },
    });
    renderPage();

    const panel = await openRow('Ліди з Google-таблиці');
    await userEvent.click(within(panel).getByRole('button', { name: 'Запустити зараз' }));
    expect(fixture.runNow).toHaveBeenCalledWith('leads');
    expect(await within(panel).findByText(/Запуск заплановано/)).toBeInTheDocument();

    await userEvent.click(within(panel).getByRole('button', { name: 'Запустити зараз' }));
    expect(await within(panel).findByRole('alert')).not.toHaveTextContent('Запуск заплановано');
  });

  it('hides the actions without rights and always for the outbox (SC-06)', async () => {
    fixture.tasks = [leads, outbox];
    renderPage([]);

    let panel = await openRow('Ліди з Google-таблиці');
    expect(
      within(panel).queryByRole('button', { name: 'Змінити розклад' }),
    ).not.toBeInTheDocument();
    expect(
      within(panel).queryByRole('button', { name: 'Запустити зараз' }),
    ).not.toBeInTheDocument();
    cleanup();

    renderPage();
    panel = await openRow('Повідомлення в Telegram');
    expect(
      within(panel).queryByRole('button', { name: 'Змінити розклад' }),
    ).not.toBeInTheDocument();
    expect(
      within(panel).queryByRole('button', { name: 'Запустити зараз' }),
    ).not.toBeInTheDocument();
  });

  it('shows a load error with «Повторити» (SC-07)', async () => {
    fixture.error = { status: 500, data: {} };
    renderPage();

    await userEvent.click(await screen.findByRole('button', { name: 'Повторити' }));
    expect(fixture.refetch).toHaveBeenCalled();
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });
});
