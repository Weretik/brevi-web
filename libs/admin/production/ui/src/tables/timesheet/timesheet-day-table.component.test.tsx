import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TimesheetDayTable } from './timesheet-day-table';

import type { TimesheetRow } from '@admin/production/model';

const row = (employeeId: number, name: string, minutes: number | null): TimesheetRow => ({
  employeeId,
  name,
  position: 'Швачка',
  isActive: true,
  minutes,
  version: minutes === null ? null : 1,
});

afterEach(cleanup);

describe('TimesheetDayTable', () => {
  it('marks only what needs attention and types hours', () => {
    const onChange = vi.fn();
    render(
      <TimesheetDayTable
        rows={[
          row(1, 'Андреева', 480),
          row(2, 'Бойко', null),
          row(3, 'Вовк', 0),
          row(4, 'Гнатюк', 240),
        ]}
        draft={{ 4: '7,3' }}
        invalid={new Set([4])}
        changed={new Set()}
        canEdit
        busy={false}
        onChange={onChange}
      />,
    );

    expect(screen.queryByText('Збережено')).not.toBeInTheDocument();
    expect(screen.getByText('Не відмічено')).toBeInTheDocument();
    expect(screen.getByText('Відсутній')).toBeInTheDocument();
    expect(screen.getByText('Години від 0 до 24, крок 0,25')).toBeInTheDocument();
    expect(screen.getByLabelText('Години: Андреева')).toHaveValue('8');
    fireEvent.click(screen.getByRole('button', { name: '8 год: Бойко' }));
    expect(onChange).toHaveBeenCalledWith(2, '8');
  });

  it('shows hours as text when the day cannot be changed', () => {
    render(
      <TimesheetDayTable
        rows={[row(1, 'Андреева', 450)]}
        draft={{}}
        invalid={new Set()}
        changed={new Set()}
        canEdit={false}
        busy={false}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText('7,5 год')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
