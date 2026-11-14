import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProductionOrdersSearchRow } from './production-orders-search-row';

import type { ComponentProps } from 'react';

const props = (
  patch: Partial<ComponentProps<typeof ProductionOrdersSearchRow>> = {},
): ComponentProps<typeof ProductionOrdersSearchRow> => ({
  search: '',
  onSearchChange: vi.fn(),
  filterCount: 0,
  onOpenFilters: vi.fn(),
  view: 'list',
  onViewChange: vi.fn(),
  ...patch,
});

afterEach(cleanup);

describe('ProductionOrdersSearchRow', () => {
  it('opens the filter panel and shows how many filters are on', async () => {
    const onOpenFilters = vi.fn();
    render(<ProductionOrdersSearchRow {...props({ filterCount: 2, onOpenFilters })} />);

    expect(screen.getByText('2')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Фільтри' }));
    expect(onOpenFilters).toHaveBeenCalled();
  });

  it('switches to the model summary and ignores a click on the current view', async () => {
    const onViewChange = vi.fn();
    render(<ProductionOrdersSearchRow {...props({ onViewChange })} />);

    await userEvent.click(screen.getByRole('button', { name: 'Список' }));
    expect(onViewChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Зведення за моделями' }));
    expect(onViewChange).toHaveBeenCalledWith('summary');
  });

  it('passes the typed search on', async () => {
    const onSearchChange = vi.fn();
    render(<ProductionOrdersSearchRow {...props({ onSearchChange })} />);

    await userEvent.type(screen.getByRole('textbox', { name: 'Пошук завдань' }), 'К');
    expect(onSearchChange).toHaveBeenCalled();
  });
});
