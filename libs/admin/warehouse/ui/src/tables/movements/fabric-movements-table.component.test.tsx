import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

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
  pairMetersAfter: -1.5,
  perProduct: null,
  note: null,
  createdByName: 'Олена',
  isReversed: true,
  reversesMovementId: null,
  canReverse: false,
  isVoided: false,
  revision: 0,
  canEdit: false,
  ...patch,
});

describe('FabricMovementsTable', () => {
  it('shows a compact row with the task, the signed quantity and the pair balance, and opens it', () => {
    const onOpen = vi.fn();
    render(<FabricMovementsTable rows={[row({})]} filtered={false} onOpen={onOpen} />);
    expect(screen.getByText('На завдання')).toBeTruthy();
    expect(screen.getByText('Ц-12 · Куртка')).toBeTruthy();
    expect(screen.getByText('Сторновано')).toBeTruthy();
    expect(screen.getByText('10.11.2026')).toBeTruthy();
    expect(screen.getByText(/−2,5/)).toBeTruthy();
    expect(screen.getByText(/-1,5|−1,5/)).toBeTruthy();
    fireEvent.click(screen.getByRole('row', { name: /На завдання: Грета, Синій/ }));
    expect(onOpen).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
  });

  it('marks a receipt with a plus and nothing else when all is fine', () => {
    render(
      <FabricMovementsTable
        rows={[
          row({
            kind: 'Receipt',
            delta: 5,
            orderId: null,
            orderNumber: null,
            isReversed: false,
            supplierName: 'Тексика',
            document: 'рах 7',
          }),
        ]}
        filtered={false}
        onOpen={() => undefined}
      />,
    );
    expect(screen.getByText(/\+5/)).toBeTruthy();
    expect(screen.getByText('Тексика · рах 7')).toBeTruthy();
    expect(screen.queryByText('Сторновано')).toBeNull();
  });

  it('says when a filter hides everything', () => {
    render(<FabricMovementsTable rows={[]} filtered onOpen={() => undefined} />);
    expect(screen.getByText('За цим фільтром рухів немає.')).toBeTruthy();
  });
});
