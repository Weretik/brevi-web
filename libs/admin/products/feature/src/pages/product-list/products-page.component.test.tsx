import { cleanup, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProductsPage, productsTabOf } from './products-page';
import { render } from '../../test-utils';

import type { ProductOverview, ProductOverviewType } from '@admin/products/model';

const row = (id: number, type: ProductOverviewType, code: string, name: string, sectionId: number | null): ProductOverview => ({
  id,
  type,
  code,
  name,
  sectionId,
  season: type === 'Sewing' ? 'Літо' : null,
  isActive: true,
  isVerified: id === 1,
  verifiedOn: id === 1 ? '08.09.2026' : null,
  currentSiteUrl: id === 1 ? 'https://brevi.com.ua/specodyag-litnij/kostyum-verde' : null,
  quoteDescription: 'Костюм із курткою та штанами.',
  updatedAtUtc: '2026-11-03T10:00:00Z',
});

const data: Record<ProductOverviewType, ProductOverview[]> = {
  Sewing: [row(1, 'Sewing', 'MOD-025', 'Костюм «Верде»', 1), row(2, 'Sewing', 'MOD-026', 'Халат', null)],
  Ppe: [row(3, 'Ppe', '17', 'Рукавиці', 9)],
};

vi.mock('../../hooks/product-overview/use-product-overview', () => ({
  useProductOverview: (type: ProductOverviewType) => ({
    rows: data[type],
    sections: type === 'Sewing' ? [{ id: 1, type, name: 'Одяг ЛІТО', isActive: true, comment: null, sortOrder: 1 }] : [],
    sectionNames: new Map([
      [1, 'Одяг ЛІТО'],
      [9, 'Захист рук'],
    ]),
    loading: false,
    error: null,
    reload: vi.fn(),
  }),
}));

afterEach(cleanup);

function renderPage(url = '/references/products') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <ProductsPage />
    </MemoryRouter>,
  );
}

describe('ProductsPage', () => {
  it('reads the tab from the URL', () => {
    expect(productsTabOf('ppe')).toBe('Ppe');
    expect(productsTabOf(null)).toBe('Sewing');
  });

  it('shows sewing models with section chips and filters by section', async () => {
    const user = userEvent.setup();
    renderPage();

    const grid = screen.getByRole('grid', { name: 'Швейна продукція' });
    expect(within(grid).getByText('MOD-025')).toBeInTheDocument();
    expect(within(grid).getByText('08.09.2026')).toBeInTheDocument();
    expect(within(grid).getByRole('link', { name: 'Відкрити «Костюм «Верде»» на сайті' })).toHaveAttribute(
      'href',
      'https://brevi.com.ua/specodyag-litnij/kostyum-verde',
    );

    await user.click(screen.getByRole('button', { name: /Без розділу/ }));
    expect(within(grid).queryByText('MOD-025')).not.toBeInTheDocument();
    expect(within(grid).getByText('Халат')).toBeInTheDocument();
  });

  it('switches to the PPE table without a season column', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('tab', { name: 'ЗІЗ' }));

    const grid = screen.getByRole('grid', { name: 'ЗІЗ' });
    expect(within(grid).getByText('Рукавиці')).toBeInTheDocument();
    expect(within(grid).getByText('Захист рук')).toBeInTheDocument();
    expect(within(grid).queryByRole('columnheader', { name: 'Сезон' })).not.toBeInTheDocument();
  });
});
