import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProductsPage } from './products-page';
import { render } from '../../test-utils';

const product = {
  id: 8,
  name: 'Куртка',
  type: 'Sewing' as const,
  categoryIds: [],
  mainPhoto: null,
  minimumWholesalePrice: 10,
  createdAtUtc: '2026-09-01T00:00:00Z',
  updatedAtUtc: null,
};

vi.mock('../../hooks/product-list/use-product-categories', () => ({
  useProductCategories: () => ({ categories: [], error: null, reload: vi.fn() }),
}));
vi.mock('../../hooks/product-list/use-products', () => ({
  useProducts: () => ({
    page: {
      value: [product],
      pagedInfo: { pageNumber: 1, pageSize: 20, totalPages: 1, totalRecords: 1 },
    },
    loading: false,
    error: null,
    reload: vi.fn(),
  }),
}));

afterEach(cleanup);

function renderPage() {
  return render(
    <MemoryRouter>
      <ProductsPage />
    </MemoryRouter>,
  );
}

describe('ProductsPage', () => {
  it('opens actions for the contextual row without changing checkbox selection', async () => {
    const user = userEvent.setup();
    renderPage();
    const row = await screen.findByRole('row', { name: /8.*Куртка/ });
    const rowCheckbox = row.querySelector('input[type="checkbox"]') as HTMLInputElement;

    expect(screen.queryByRole('columnheader', { name: 'Дії' })).not.toBeInTheDocument();
    await user.click(rowCheckbox);
    fireEvent.contextMenu(row, { clientX: 80, clientY: 120 });

    expect(rowCheckbox).toBeChecked();
    expect(screen.getByRole('menuitem', { name: 'Перегляд' })).toHaveAttribute(
      'href',
      '/references/products/8',
    );
    expect(screen.getByRole('menuitem', { name: 'Змінити' })).toHaveAttribute(
      'href',
      '/references/products/8/edit',
    );
    expect(screen.getByRole('menuitem', { name: 'Видалити' })).toBeVisible();
  });

  it('opens the same menu with Shift+F10 and restores focus after Escape', async () => {
    const user = userEvent.setup();
    renderPage();
    const row = await screen.findByRole('row', { name: /8.*Куртка/ });
    const nameCell = screen.getByRole('gridcell', { name: 'Куртка' });
    nameCell.focus();

    fireEvent.keyDown(nameCell, { key: 'F10', shiftKey: true });
    expect(screen.getByRole('menuitem', { name: 'Перегляд' })).toBeVisible();
    await user.keyboard('{Escape}');

    await waitFor(() => expect(nameCell).toHaveFocus());
    expect(row).toBeInTheDocument();
  });

  it('keeps all query fields on a white surface', () => {
    renderPage();

    for (const control of [
      screen.getByRole('textbox', { name: 'Пошук за ID або назвою' }),
      screen.getByRole('combobox', { name: 'Тип' }),
      screen.getByRole('combobox', { name: 'Категорія' }),
    ]) {
      const surface = control.closest('.MuiOutlinedInput-root');
      expect(surface).not.toBeNull();
      expect(getComputedStyle(surface!).backgroundColor).toBe('rgb(255, 255, 255)');
    }
  });
});
