import { emptyReminderTaskForm } from '@admin/reminders/model';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ReminderTaskForm } from './reminder-task-form';

afterEach(cleanup);

describe('ReminderTaskForm', () => {
  it('shows the day field only for rules that use it and reports changes', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <ReminderTaskForm
        values={emptyReminderTaskForm}
        errors={{ day: 'Від 1 до 31.' }}
        chats={[]}
        disabled={false}
        onChange={onChange}
      />,
    );
    expect(screen.getByText('Від 1 до 31.')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'Число місяця' }), {
      target: { value: '15' },
    });
    expect(onChange).toHaveBeenCalledWith({ day: '15' });

    rerender(
      <ReminderTaskForm
        values={{ ...emptyReminderTaskForm, dueRule: 'lastWorkingDayOfMonth' }}
        errors={{}}
        chats={[]}
        disabled={false}
        onChange={onChange}
      />,
    );
    expect(screen.queryByRole('textbox', { name: 'Число місяця' })).not.toBeInTheDocument();
    expect(screen.getByText('Спершу додайте бота в чат і підтвердьте його.')).toBeInTheDocument();
  });
});
