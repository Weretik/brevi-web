import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ApplicationsCell, FabricColorCell, OrderCell } from './production-order-item-cells';

import type { ProductionOrderSummary } from '@admin/production/model';

afterEach(cleanup);

const row: ProductionOrderSummary = {
  id: 1,
  number: 38,
  status: 'New',
  clientName: 'Будмонтаж',
  quoteId: null,
  quoteNumber: null,
  managerName: 'Олена',
  orderDate: '2026-11-01',
  itemsCount: 2,
  totalQuantity: 25,
  nearestDueDate: '2026-12-01',
  isTransferred: false,
  updatedAt: '2026-11-04T10:00:00Z',
  stage: 'Cutting',
  shippedQuantity: 5,
  items: [
    {
      modelCode: 'MOD-1',
      modelName: 'Куртка',
      quantity: 15,
      stage: 'Cutting',
      fabricName: 'Габардин',
      mainColor: 'Синій',
      additionalColors: ['Білий'],
      applications: ['Embroidery'],
    },
    {
      modelCode: 'MOD-2',
      modelName: 'Штани',
      quantity: 10,
      stage: 'Sewing',
      fabricName: 'Габардин',
      mainColor: 'Синій',
      additionalColors: [],
      applications: ['Embroidery', 'Print'],
    },
  ],
};

describe('order row cells', () => {
  it('shows the models first, the client small under them and the chosen model before the rest', () => {
    render(<OrderCell row={row} firstModelCode="MOD-2" />);
    expect(screen.getByText('Штани ×10 · Куртка ×15')).toBeTruthy();
    expect(screen.getByText('Будмонтаж')).toBeTruthy();
    expect(screen.getByTitle('Відвантажено 5 з 25 шт.')).toBeTruthy();
  });

  it('lists the application kinds, the fabric and the colours once', () => {
    render(
      <>
        <ApplicationsCell row={row} />
        <FabricColorCell row={row} />
      </>,
    );
    expect(screen.getByText('Вишивка · Друк')).toBeTruthy();
    expect(screen.getByText('Габардин')).toBeTruthy();
    expect(screen.getByText('Синій + Білий · Синій')).toBeTruthy();
  });

  it('shows a dash where an order has no applications', () => {
    render(<ApplicationsCell row={{ ...row, items: [] }} />);
    expect(screen.getByText('—')).toBeTruthy();
  });
});
