import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import WorkshopPeoplePage from './workshop-people-page';

vi.mock('../timesheet/timesheet-page', () => ({ default: () => <p>Сторінка годин</p> }));
vi.mock('../payroll/payroll-page', () => ({ default: () => <p>Сторінка зарплати</p> }));
vi.mock('../staff/workshop-staff-page', () => ({ default: () => <p>Список працівників</p> }));

function renderPage(access: { staff: boolean; timesheet: boolean; payroll: boolean }, url = '/') {
  render(
    <MemoryRouter initialEntries={[url]}>
      <WorkshopPeoplePage useAccess={() => access} />
    </MemoryRouter>,
  );
}

afterEach(cleanup);

describe('WorkshopPeoplePage', () => {
  it('opens «Робочий час» first and switches tabs', async () => {
    renderPage({ staff: true, timesheet: true, payroll: true });

    expect(await screen.findByText('Сторінка годин')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Зарплата' }));
    expect(await screen.findByText('Сторінка зарплати')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Працівники' }));
    expect(await screen.findByText('Список працівників')).toBeInTheDocument();
  });

  it('opens the tab named in the address', async () => {
    renderPage({ staff: true, timesheet: true, payroll: true }, '/?tab=staff');

    expect(await screen.findByText('Список працівників')).toBeInTheDocument();
  });

  it('hides a tab the person has no right to and falls back to the first allowed one', async () => {
    renderPage({ staff: false, timesheet: true, payroll: false }, '/?tab=payroll');

    expect(screen.queryByRole('tab', { name: 'Зарплата' })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'Працівники' })).not.toBeInTheDocument();
    expect(await screen.findByText('Сторінка годин')).toBeInTheDocument();
  });
});
