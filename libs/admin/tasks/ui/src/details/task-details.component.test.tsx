import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TaskDetails } from './task-details';

import type { TaskDetail } from '@admin/tasks/model';

const task: TaskDetail = {
  id: 1,
  number: 'ЗД-0001',
  title: 'Зателефонувати клієнту',
  status: 'New',
  lane: 'Active',
  isUrgent: false,
  isOverdue: false,
  dueAt: '2030-01-01T10:00:00Z',
  assignee: { userId: 5, name: 'Олена' },
  customerName: null,
  stepsTotal: 0,
  stepsDone: 0,
  completedAt: null,
  updatedAt: '2026-11-04T10:00:00Z',
  version: 1,
  description: null,
  author: { userId: 1, name: 'Директор' },
  customerPublicId: null,
  leadId: null,
  steps: [],
  history: [],
  createdAt: '2026-11-04T10:00:00Z',
};

afterEach(cleanup);

describe('TaskDetails', () => {
  it('lets Director and Admin pass the task to another manager', async () => {
    const user = userEvent.setup();
    const onReassign = vi.fn();
    render(
      <TaskDetails
        task={task}
        busy={false}
        onStatus={vi.fn()}
        onStep={vi.fn()}
        assignees={[
          { userId: 5, name: 'Олена', email: null },
          { userId: 6, name: 'Петро', email: null },
        ]}
        onReassign={onReassign}
      />,
    );

    await user.click(screen.getByRole('combobox', { name: 'Виконавець' }));
    await user.click(within(screen.getByRole('listbox')).getByRole('option', { name: 'Петро' }));

    expect(onReassign).toHaveBeenCalledWith(6);
  });

  it('shows the manager as text to a manager', () => {
    render(<TaskDetails task={task} busy={false} onStatus={vi.fn()} onStep={vi.fn()} />);

    expect(screen.queryByRole('combobox', { name: 'Виконавець' })).toBeNull();
    expect(screen.getByText('Олена')).toBeVisible();
  });

  it('links a «Подзвонити» task to its lead', () => {
    render(
      <MemoryRouter>
        <TaskDetails
          task={{ ...task, leadId: 42 }}
          busy={false}
          onStatus={vi.fn()}
          onStep={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Відкрити в «Ліди › Мій день»' })).toHaveAttribute(
      'href',
      '/crm/leads?lead=42',
    );
  });
});
