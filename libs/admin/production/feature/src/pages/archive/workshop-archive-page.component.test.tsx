import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import WorkshopArchivePage from './workshop-archive-page';

const api = vi.hoisted(() => ({
  archiveArgs: [] as unknown[],
  ordersArgs: [] as unknown[],
  row: {
    id: 1,
    sourceRow: 12,
    date: '2024-03-05',
    dateText: null,
    number: '417',
    client: 'ТОВ Ромашка',
    product: 'Фартух кухаря',
    quantity: '10+4',
    fabric: 'Габардин',
    status: null,
    notes: null,
    fields: [],
    links: [{ label: 'Документ', url: 'https://docs.google.com/document/d/1' }],
  },
}));

vi.mock('@admin/production/data-access', () => ({
  useGetWorkshopArchiveQuery: (arg: unknown, options: { skip: boolean }) => {
    if (!options.skip) api.archiveArgs.push(arg);
    return {
      data: options.skip
        ? undefined
        : { kind: 'Schedule', page: 1, pageSize: 50, total: 1, items: [api.row] },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    };
  },
  useGetProductionOrdersQuery: (arg: unknown, options: { skip: boolean }) => {
    if (!options.skip) api.ordersArgs.push(arg);
    return { data: undefined, isLoading: false, isFetching: false, refetch: vi.fn() };
  },
  useImportWorkshopArchiveMutation: () => [vi.fn(), { isLoading: false }],
}));

afterEach(() => {
  cleanup();
  api.archiveArgs.length = 0;
  api.ordersArgs.length = 0;
});

const renderPage = (canImport = false) =>
  render(
    <MemoryRouter>
      <WorkshopArchivePage useOrderActor={() => ({ canCreate: false, canImport })} />
    </MemoryRouter>,
  );

describe('WorkshopArchivePage', () => {
  it('opens an old line read only, with its links', () => {
    renderPage();
    const grid = screen.getByRole('grid', { name: 'Архів цеху' });
    fireEvent.click(within(grid).getByText('ТОВ Ромашка'));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Фартух кухаря')).toBeTruthy();
    expect(within(dialog).getByRole('link', { name: /Документ/ })).toBeTruthy();
    expect(within(dialog).queryByRole('button', { name: 'Редагувати' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Імпорт' })).toBeNull();
  });

  it('asks the closed orders on their tab and warns about a wrong period', () => {
    renderPage(true);
    expect(screen.getByRole('button', { name: 'Імпорт' })).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Від'), { target: { value: '2025-02-01' } });
    fireEvent.change(screen.getByLabelText('До'), { target: { value: '2025-01-01' } });
    expect(screen.getByText('Дата «Від» пізніша за «До».')).toBeTruthy();

    fireEvent.click(screen.getByRole('tab', { name: 'Закриті завдання' }));
    expect(api.ordersArgs.at(-1)).toMatchObject({ status: 'Closed', page: 1 });
    expect(screen.queryByLabelText('Від')).toBeNull();
  });
});
