import { cleanup, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductDetailPage } from './product-detail-page';
import { render } from '../../test-utils';

import type { ProductDetail } from '@admin/products/model';

const product: ProductDetail = {
  id: 8,
  name: 'Куртка',
  ruName: 'Куртка',
  slug: 'jacket',
  type: 'Sewing',
  descriptionUk: 'Опис',
  descriptionRu: 'Описание',
  categoryIds: [],
  categories: [],
  mainPhoto: null,
  createdAtUtc: '2026-09-01T00:00:00Z',
  updatedAtUtc: null,
  minimumWholesalePrice: 10,
  photos: [],
  informationBlocks: [],
  characteristicTables: [],
  sewing: {
    metersPerProduct: 2,
    fabrics: [],
    accessories: [],
    operations: [],
    piecesPerShift: null,
    prices: null,
  },
  ppe: null,
};

const pageMocks = vi.hoisted(() => ({
  useProduct: vi.fn(),
  sewingProductCard: vi.fn((props: unknown) => {
    void props;
    return null;
  }),
  ppeProductCard: vi.fn((props: unknown) => {
    void props;
    return null;
  }),
}));

vi.mock('../../hooks/product-detail/use-product', () => ({
  useProduct: pageMocks.useProduct,
}));

vi.mock('../../components/sewing-card/sewing-product-card', () => ({
  SewingProductCard: pageMocks.sewingProductCard,
}));

vi.mock('../../components/ppe-card/ppe-product-card', () => ({
  PpeProductCard: pageMocks.ppeProductCard,
}));

beforeEach(() => {
  pageMocks.useProduct.mockReturnValue({
    product,
    loading: false,
    error: null,
    notFound: false,
    reload: vi.fn(),
  });
  pageMocks.sewingProductCard.mockClear();
  pageMocks.ppeProductCard.mockClear();
});

afterEach(cleanup);

const ppeProduct: ProductDetail = {
  ...product,
  type: 'Ppe',
  sewing: null,
  ppe: {
    supplier: { id: 1, name: 'Постачальник' },
    basePrice: 100,
    retailPercent: { source: 'Custom', customPercent: 5 },
    wholesalePercent: { source: 'Custom', customPercent: 10 },
    retailPrice: 105,
    wholesalePrice: 110,
  },
};

function renderPage() {
  render(
    <MemoryRouter initialEntries={['/references/products/8']}>
      <Routes>
        <Route path="/references/products/:id" element={<ProductDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProductDetailPage', () => {
  it('opens the sewing card (CAT-007) for a sewing model', () => {
    renderPage();

    expect(pageMocks.sewingProductCard.mock.calls.at(-1)?.[0]).toEqual(
      expect.objectContaining({ product, onDeleted: expect.any(Function) }),
    );
    expect(screen.queryByRole('region', { name: 'Опис' })).not.toBeInTheDocument();
  });

  it('opens the PPE card (CAT-008) for a PPE product', () => {
    pageMocks.useProduct.mockReturnValue({
      product: ppeProduct,
      loading: false,
      error: null,
      notFound: false,
      reload: vi.fn(),
    });
    renderPage();

    expect(pageMocks.ppeProductCard.mock.calls.at(-1)?.[0]).toEqual(
      expect.objectContaining({ product: ppeProduct, onDeleted: expect.any(Function) }),
    );
    expect(pageMocks.sewingProductCard).not.toHaveBeenCalled();
  });
});
