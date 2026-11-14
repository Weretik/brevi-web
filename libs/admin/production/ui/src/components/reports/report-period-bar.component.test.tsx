import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ReportPeriodBar } from './report-period-bar';

import type { ComponentProps } from 'react';

const props = (
  patch: Partial<ComponentProps<typeof ReportPeriodBar>> = {},
): ComponentProps<typeof ReportPeriodBar> => ({
  current: '2026-11',
  from: '2026-11',
  to: '2026-11',
  onFromChange: vi.fn(),
  onToChange: vi.fn(),
  compare: false,
  onCompareChange: vi.fn(),
  compareFrom: '2026-10',
  compareTo: '2026-10',
  onCompareFromChange: vi.fn(),
  onCompareToChange: vi.fn(),
  ...patch,
});

afterEach(cleanup);

describe('ReportPeriodBar', () => {
  it('shows the comparison months only when comparing', async () => {
    const onCompareChange = vi.fn();
    const { rerender } = render(<ReportPeriodBar {...props({ onCompareChange })} />);

    expect(screen.getAllByLabelText('Від')).toHaveLength(1);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Порівняти з' }));
    expect(onCompareChange).toHaveBeenCalledWith(true);
    rerender(<ReportPeriodBar {...props({ compare: true })} />);
    expect(screen.getAllByLabelText('Від')).toHaveLength(2);
  });

  it('passes a chosen month on', () => {
    const onFromChange = vi.fn();
    render(<ReportPeriodBar {...props({ onFromChange })} />);

    fireEvent.change(screen.getByLabelText('Від'), { target: { value: '2026-09' } });
    expect(onFromChange).toHaveBeenCalledWith('2026-09');
  });
});
