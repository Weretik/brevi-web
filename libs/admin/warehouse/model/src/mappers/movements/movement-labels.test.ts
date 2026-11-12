import { describe, expect, it } from 'vitest';

import { movementCancelMark, movementOperationLabel, movementSource } from './movement-labels';

import type { FabricMovementRow } from '../../entities/movements/fabric-movement';

const row = (change: Partial<FabricMovementRow>): FabricMovementRow => ({
  id: 1,
  stockId: 1,
  kind: 'Receipt',
  operationDate: '2026-11-05',
  createdAt: '2026-11-05T09:00:00Z',
  fabricCode: 'FAB-023',
  groupCode: 'FAB-023',
  fabricName: 'Габардин',
  color: 'Темно-сірий',
  supplierName: null,
  document: null,
  orderId: null,
  itemId: null,
  orderNumber: null,
  modelName: null,
  destination: null,
  delta: 5,
  metersAfter: 5,
  pairMetersAfter: 5,
  perProduct: null,
  note: null,
  createdByName: 'Олена',
  isReversed: false,
  reversesMovementId: null,
  canReverse: true,
  isVoided: false,
  revision: 0,
  canEdit: true,
  ...change,
});

describe('movement labels', () => {
  it('names an issue by whether it went to a task', () => {
    expect(movementOperationLabel(row({ kind: 'Issue', orderId: 4 }))).toBe('На завдання');
    expect(movementOperationLabel(row({ kind: 'Issue' }))).toBe('Разова витрата');
    expect(movementOperationLabel(row({ kind: 'Reversal' }))).toBe('Сторно');
  });

  it('says where the fabric came from or went', () => {
    expect(
      movementSource(row({ kind: 'Issue', orderId: 4, orderNumber: 12, modelName: 'Халат' })),
    ).toBe('Ц-12 · Халат');
    expect(movementSource(row({ supplierName: 'Черкаси ВВ', document: 'рах 12137' }))).toBe(
      'Черкаси ВВ · рах 12137',
    );
    expect(movementSource(row({ kind: 'Issue', destination: 'Пошиття зразка' }))).toBe(
      'Пошиття зразка',
    );
    expect(movementSource(row({ kind: 'Adjustment', note: 'Інвентаризація' }))).toBe(
      'Інвентаризація',
    );
    expect(movementSource(row({}))).toBeNull();
  });

  it('marks only cancelled rows', () => {
    expect(movementCancelMark(row({ isVoided: true }))).toBe('Прибрано з обліку');
    expect(movementCancelMark(row({ isReversed: true }))).toBe('Сторновано');
    expect(movementCancelMark(row({}))).toBeNull();
  });
});
