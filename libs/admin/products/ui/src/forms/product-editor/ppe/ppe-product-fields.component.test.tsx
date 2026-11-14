import { emptyProductDraft } from '@admin/products/model';
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';

import { PpeProductFields } from './ppe-product-fields';

it('archives existing Product base price and exposes no retired markup controls', () => {
  render(
    <PpeProductFields
      draft={emptyProductDraft('Ppe')}
      setDraft={vi.fn()}
      errors={{}}
      existingProduct
      lookups={{
        categories: [],
        media: [],
        fabrics: [],
        accessories: [],
        operations: [],
        suppliers: [],
        references: [],
      }}
    />,
  );
  expect(
    screen
      .getByRole('spinbutton', { name: 'Початкова ціна постачальника (архів)' })
      .hasAttribute('disabled'),
  ).toBe(true);
  expect(screen.queryByText('Роздрібний відсоток')).toBeNull();
  expect(screen.queryByText('Оптовий відсоток')).toBeNull();
  expect(screen.getByText(/не активує розрахунок автоматично/)).toBeTruthy();
});
