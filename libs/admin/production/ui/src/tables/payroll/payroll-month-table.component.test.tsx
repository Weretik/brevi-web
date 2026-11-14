import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PayrollMonthTable } from './payroll-month-table';

import type { PayrollLine, PayrollTotals } from '@admin/production/model';

const line: PayrollLine = {
  employeeId: 1,
  name: 'Андреева',
  position: 'Швачка',
  isActive: true,
  minutes: 480,
  sewn: 3,
  sewing: 1029.75,
  cut: 0,
  cutting: 0,
  bonus: 0,
  master: 0,
  chief: 0,
  embroidery: 0,
  other: -29.75,
  accrued: 1000,
  paid: 500,
  due: 500,
  issued: null,
};

const totals: PayrollTotals = { ...line, issued: 0 };

afterEach(cleanup);

describe('PayrollMonthTable', () => {
  it('opens a worker and saves «Видано» for Admin', async () => {
    const onOpen = vi.fn();
    const onSaveIssued = vi.fn().mockResolvedValue(true);
    render(
      <PayrollMonthTable
        lines={[line]}
        totals={totals}
        canEditIssued
        busy={false}
        onOpen={onOpen}
        onSaveIssued={onSaveIssued}
      />,
    );

    expect(screen.getByText('3 шт.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Андреева' }));
    expect(onOpen).toHaveBeenCalledWith(line);
    const save = screen.getByRole('button', { name: 'Зберегти «Видано»: Андреева' });
    expect(save).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Видано: Андреева'), { target: { value: '500' } });
    fireEvent.click(save);
    expect(onSaveIssued).toHaveBeenCalledWith(line, '500');
  });

  it('shows «Видано» read-only to the head of the workshop', () => {
    render(
      <PayrollMonthTable
        lines={[{ ...line, issued: 450 }]}
        totals={totals}
        canEditIssued={false}
        busy={false}
        onOpen={vi.fn()}
        onSaveIssued={vi.fn()}
      />,
    );

    expect(screen.queryByLabelText('Видано: Андреева')).not.toBeInTheDocument();
    expect(screen.getAllByText(/450,00/).length).toBeGreaterThan(0);
  });
});
