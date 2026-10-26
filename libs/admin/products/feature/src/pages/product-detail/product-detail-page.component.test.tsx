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
  sewingCompositionFeature: vi.fn((props: unknown) => {
    void props;
    return null;
  }),
}));

vi.mock('../../hooks/product-detail/use-product', () => ({
  useProduct: pageMocks.useProduct,
}));

vi.mock('../../components/sewing-composition/sewing-composition-feature', () => ({
  SewingCompositionFeature: pageMocks.sewingCompositionFeature,
}));

beforeEach(() => {
  pageMocks.useProduct.mockReturnValue({
    product,
    loading: false,
    error: null,
    notFound: false,
    reload: vi.fn(),
  });
  pageMocks.sewingCompositionFeature.mockClear();
});

afterEach(cleanup);

describe('ProductDetailPage', () => {
  it('groups read-only product data into semantic surfaces and keeps the edit route', () => {
    render(
      <MemoryRouter initialEntries={['/references/products/8']}>
        <Routes>
          <Route path="/references/products/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Редагувати' })).toHaveAttribute(
      'href',
      '/references/products/8/edit',
    );
    for (const name of [
      'Основні дані',
      'Фото',
      'Опис',
      'Інформація',
      'Характеристики',
      'Виробництво',
    ]) {
      expect(screen.getByRole('region', { name })).toHaveClass('MuiCard-root');
    }
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(pageMocks.sewingCompositionFeature.mock.calls.at(-1)?.[0]).toEqual(
      expect.objectContaining({ productId: 8, onDirtyChange: expect.any(Function) }),
    );
  });

  it('does not mount sewing composition orchestration for a PPE Product', () => {
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
    pageMocks.useProduct.mockReturnValue({
      product: ppeProduct,
      loading: false,
      error: null,
      notFound: false,
      reload: vi.fn(),
    });
    render(
      <MemoryRouter initialEntries={['/references/products/8']}>
        <Routes>
          <Route path="/references/products/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(pageMocks.sewingCompositionFeature).not.toHaveBeenCalled();
    expect(
      screen.queryByRole('region', { name: 'Артикули та склад виробу' }),
    ).not.toBeInTheDocument();
  });
});
