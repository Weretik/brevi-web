import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import WorkshopPeoplePage from './workshop-people-page';

vi.mock('@admin/production/data-access', () => ({
  useGetPayrollMonthQuery: () => ({
    data: undefined,
    error: undefined,
    isFetching: false,
    refetch: vi.fn(),
  }),
  useGetPayrollYearQuery: () => ({
    data: undefined,
    error: undefined,
    isFetching: false,
    refetch: vi.fn(),
  }),
}));
vi.mock('../timesheet/timesheet-page', () => ({ default: () => <p>Сторінка годин</p> }));
vi.mock('../staff/workshop-staff-page', () => ({ default: () => <p>Список працівників</p> }));
vi.mock('../../components/payroll/payroll-month-view', () => ({
  PayrollMonthView: () => <p>Місяць цеху</p>,
}));

const all = { staff: true, timesheet: true, payroll: true };

function renderPage(access: { staff: boolean; timesheet: boolean; payroll: boolean }, url = '/') {
  render(
    <MemoryRouter initialEntries={[url]}>
      <WorkshopPeoplePage useAccess={() => access} />
    </MemoryRouter>,
  );
}

afterEach(cleanup);

describe('WorkshopPeoplePage', () => {
  it('opens the month first, with the shared period switch, and switches tabs', async () => {
    renderPage(all);

    expect(screen.getByRole('tab', { name: 'Місяць' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: 'Попередній період' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Працівники' }));
    expect(await screen.findByText('Список працівників')).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'Робочий час' })).not.toBeInTheDocument();
  });

  it('keeps old addresses working: ?tab=payroll is the month, ?tab=timesheet opens the day panel', async () => {
    renderPage(all, '/?tab=timesheet');

    // The open panel hides the page behind it from the accessibility tree.
    expect(screen.getByRole('tab', { name: 'Місяць', hidden: true })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(await screen.findByText('Сторінка годин')).toBeInTheDocument();
  });

  it('gives hours alone their own tab when the person has no right to «Зарплата»', async () => {
    renderPage({ staff: false, timesheet: true, payroll: false });

    expect(screen.queryByRole('tab', { name: 'Місяць' })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'Працівники' })).not.toBeInTheDocument();
    expect(await screen.findByText('Сторінка годин')).toBeInTheDocument();
  });

  it('shows nothing of pay to a person who only keeps the list of workers', async () => {
    renderPage({ staff: true, timesheet: false, payroll: false }, '/?tab=month');

    expect(screen.queryByRole('tab', { name: 'Місяць' })).not.toBeInTheDocument();
    expect(await screen.findByText('Список працівників')).toBeInTheDocument();
  });
});
