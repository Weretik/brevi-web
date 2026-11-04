import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PayrollParametersTable } from './payroll-parameters-table';

describe('PayrollParametersTable', () => {
  it('marks only the parameter with a problem', () => {
    render(
      <PayrollParametersTable
        loading={false}
        rows={[
          {
            code: 'SHOP_MANAGER_RATE',
            purpose: 'Начальник цеху: частка від загальної суми за пошиття всіх швачок',
            name: 'Відсоток начальника цеху',
            value: 12,
            unit: '%',
            updatedOn: '2026-11-02',
            problem: null,
          },
          {
            code: 'MASTER_RATE',
            purpose: 'Майстер цеху: частка від загальної суми за пошиття всіх швачок',
            name: null,
            value: null,
            unit: null,
            updatedOn: null,
            problem: 'Параметра немає в «Параметри ціноутворення».',
          },
        ]}
      />,
    );
    const rows = screen.getAllByRole('row');
    expect(within(rows[1]).getByText('12 %')).toBeTruthy();
    expect(within(rows[1]).queryByText(/Параметра немає/)).toBeNull();
    expect(within(rows[2]).getByText('Параметра немає в «Параметри ціноутворення».')).toBeTruthy();
  });
});
