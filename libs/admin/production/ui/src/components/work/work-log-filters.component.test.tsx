import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { WorkLogFilters } from './work-log-filters';

import type { ComponentProps } from 'react';

const props = (
  patch: Partial<ComponentProps<typeof WorkLogFilters>> = {},
): ComponentProps<typeof WorkLogFilters> => ({
  month: '2026-11',
  canGoForward: false,
  onShiftMonth: vi.fn(),
  employees: [{ id: 4, fullName: 'Олена Коваль', position: 'Швачка' }],
  employeeId: null,
  onEmployeeChange: vi.fn(),
  orders: [{ id: 1, label: '№ 10 · Нива' }],
  orderId: null,
  onOrderChange: vi.fn(),
  ...patch,
});

afterEach(cleanup);

describe('WorkLogFilters', () => {
  it('moves back a month and blocks a future month', async () => {
    const onShiftMonth = vi.fn();
    render(<WorkLogFilters {...props({ onShiftMonth })} />);

    expect(screen.getByRole('button', { name: 'Наступний місяць' })).toHaveProperty(
      'disabled',
      true,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Попередній місяць' }));
    expect(onShiftMonth).toHaveBeenCalledWith(-1);
  });

  it('picks an employee', async () => {
    const onEmployeeChange = vi.fn();
    render(<WorkLogFilters {...props({ onEmployeeChange })} />);

    await userEvent.click(screen.getByRole('combobox', { name: 'Працівник' }));
    await userEvent.click(await screen.findByRole('option', { name: 'Олена Коваль' }));
    expect(onEmployeeChange).toHaveBeenCalledWith(4);
  });
});
