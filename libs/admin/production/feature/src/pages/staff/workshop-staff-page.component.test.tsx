import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import WorkshopStaffPage from './workshop-staff-page';

const api = vi.hoisted(() => {
  const worker = (id: number, fullName: string, position: string, isActive = true) => ({
    id,
    fullName,
    position,
    isActive,
    updatedAt: '2026-11-04T10:00:00Z',
  });
  return {
    setActive: vi.fn(),
    staff: [
      worker(1, 'Олена Коваль', 'Швачка'),
      worker(2, 'Ірина Бондар', 'Закрійник'),
      worker(3, 'Марія Шевчук', 'Швачка', false),
    ],
    mutation: (fn: (arg: unknown) => unknown) => () => [
      (arg: unknown) => ({ unwrap: () => fn(arg) }),
      { isLoading: false },
    ],
  };
});

vi.mock('@admin/production/data-access', () => ({
  useGetWorkshopStaffQuery: () => ({
    data: api.staff,
    isLoading: false,
    isFetching: false,
    refetch: vi.fn(),
  }),
  useCreateWorkshopEmployeeMutation: api.mutation(vi.fn()),
  useUpdateWorkshopEmployeeMutation: api.mutation(vi.fn()),
  useImportWorkshopStaffMutation: api.mutation(vi.fn()),
  useSetWorkshopEmployeeActiveMutation: api.mutation((arg) => {
    api.setActive(arg);
    return Promise.resolve(api.staff[0]);
  }),
}));

afterEach(cleanup);

const renderPage = () =>
  render(
    <MemoryRouter>
      <WorkshopStaffPage />
    </MemoryRouter>,
  );

describe('WorkshopStaffPage', () => {
  it('lists working staff and shows the archive on its chip', () => {
    renderPage();
    const grid = screen.getByRole('grid', { name: 'Працівники цеху' });
    expect(within(grid).getByText('Олена Коваль')).toBeTruthy();
    expect(within(grid).queryByText('Марія Шевчук')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Архів 1' }));
    const archive = screen.getByRole('grid', { name: 'Архів працівників' });
    expect(within(archive).getByText('Марія Шевчук')).toBeTruthy();
  });

  it('archives a worker after confirmation', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Дії: Олена Коваль' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: 'В архів' }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'В архів' }));

    expect(await screen.findByText('Олена Коваль перенесено в архів.')).toBeTruthy();
    expect(api.setActive).toHaveBeenCalledWith({ id: 1, isActive: false });
  });
});
