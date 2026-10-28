import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { QuoteCatalogPicker } from './quote-catalog-picker';

import type { QuotePriceSelection } from '@admin/clients/model';

const queries = vi.hoisted(() => ({ products: vi.fn(), articles: vi.fn(), change: vi.fn() }));
vi.mock('@admin/products/data-access', () => ({
  useListProductsQuery: queries.products,
  useListSewingArticlesQuery: queries.articles,
}));
describe('Catalog selection for a quote (SC-Q01/03)', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });
  it('uses Catalog product/article identities and disables inactive articles', async () => {
    queries.products.mockReturnValue({
      currentData: { value: [{ id: 25, name: 'Куртка' }], pagedInfo: { totalPages: 1 } },
      isFetching: false,
    });
    queries.articles.mockReturnValue({
      currentData: {
        articles: [
          { id: 246, productId: 25, saleSku: 'SKU-246', active: true },
          { id: 247, productId: 25, saleSku: 'SKU-247', active: false },
        ],
      },
      isFetching: false,
    });
    function Picker() {
      const [selection, setSelection] = useState<QuotePriceSelection>({
        kind: 'sewing',
        productId: 0,
        articleId: 0,
      });
      return (
        <QuoteCatalogPicker
          selection={selection}
          disabled={false}
          onChange={(value) => {
            queries.change(value);
            setSelection(value);
          }}
        />
      );
    }
    render(<Picker />);
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Товар КП' }));
    fireEvent.click(screen.getByRole('option', { name: 'Куртка' }));
    fireEvent.mouseDown(await screen.findByRole('combobox', { name: 'Артикул КП' }));
    expect(screen.getByRole('option', { name: 'SKU-247 — неактивний' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    fireEvent.click(screen.getByRole('option', { name: 'SKU-246' }));
    expect(queries.change).toHaveBeenLastCalledWith({
      kind: 'sewing',
      productId: 25,
      articleId: 246,
    });
    expect(queries.articles).toHaveBeenLastCalledWith(25, { skip: false });
  });
});
