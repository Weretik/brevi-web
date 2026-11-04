import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TaskBoard } from './task-board';

import type { TaskSummary } from '@admin/tasks/model';

const base: TaskSummary = {
  id: 1,
  number: 'ЗД-0001',
  title: 'Зателефонувати клієнту',
  status: 'New',
  lane: 'Active',
  isUrgent: false,
  isOverdue: false,
  dueAt: '2030-01-01T10:00:00Z',
  assignee: { userId: 5, name: 'Олена' },
  customerName: 'ТОВ «Агро»',
  stepsTotal: 0,
  stepsDone: 0,
  completedAt: null,
  updatedAt: '2026-11-04T10:00:00Z',
  version: 1,
};

afterEach(cleanup);

describe('TaskBoard', () => {
  it('puts cards into their lanes and opens a card on click', () => {
    const onOpen = vi.fn();
    render(
      <TaskBoard
        tasks={[
          base,
          {
            ...base,
            id: 2,
            number: 'ЗД-0002',
            title: 'Відправити КП',
            lane: 'Overdue',
            isOverdue: true,
          },
        ]}
        viewer={{ userId: 5, isAdmin: false }}
        showAssignee={false}
        onOpen={onOpen}
        onMove={vi.fn()}
      />,
    );
    expect(screen.getByText('Термінових завдань немає')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'ЗД-0002 Відправити КП' }));
    expect(onOpen).toHaveBeenCalledWith(2);
  });

  it('shows whose card it is only when asked', () => {
    render(
      <TaskBoard
        tasks={[base]}
        viewer={{ userId: 1, isAdmin: true }}
        showAssignee
        onOpen={vi.fn()}
        onMove={vi.fn()}
      />,
    );
    const card = screen.getByRole('button', { name: 'ЗД-0001 Зателефонувати клієнту' });
    expect(within(card).getByTitle('Олена')).toBeInTheDocument();
  });
});
