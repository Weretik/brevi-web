import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FabricMovementsTable } from './fabric-movements-table';

import type { FabricMovementRow } from '@admin/warehouse/model';

const row = (patch: Partial<FabricMovementRow>): FabricMovementRow => ({
  id: 1,
  stockId: 1,
  kind: 'Issue',
  operationDate: '2026-11-10',
  createdAt: '2026-11-11T08:00:00Z',
  fabricCode: 'FAB-023',
  groupCode: 'FAB-023',
  fabricName: 'Грета',
  color: 'Синій',
  supplierName: null,
  document: null,
  orderId: 4,
  itemId: 9,
  orderNumber: 12,
  modelName: 'Куртка',
  destination: null,
  delta: -2.5,
  metersAfter: 7.5,
  note: null,
  createdByName: 'Олена',
  isReversed: true,
  reversesMovementId: null,
  canReverse: false,
  ...patch,
});

describe('FabricMovementsTable', () => {
  it('names an order issue, keeps a reversed row in the history and offers no «Сторно» for it', () => {
    render(<FabricMovementsTable rows={[row({})]} filtered={false} onReverse={() => undefined} />);
    expect(screen.getByText('Видача на завдання')).toBeTruthy();
    expect(screen.getByText('Завдання №12 · Куртка')).toBeTruthy();
    expect(screen.getByText('Сторновано')).toBeTruthy();
    expect(screen.getByText('10.11.2026')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /^Сторно/ })).toBeNull();
  });

  it('says when a filter hides everything', () => {
    render(<FabricMovementsTable rows={[]} filtered onReverse={null} />);
    expect(screen.getByText('За цим фільтром рухів немає.')).toBeTruthy();
  });
});
