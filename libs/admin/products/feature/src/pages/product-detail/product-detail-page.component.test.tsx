import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

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

vi.mock('../../hooks/product-detail/use-product', () => ({
  useProduct: () => ({
    product,
    loading: false,
    error: null,
    notFound: false,
    reload: vi.fn(),
  }),
}));

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
  });
});
