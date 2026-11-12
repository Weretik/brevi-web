import type { FabricMovementRow } from '../../entities/movements/fabric-movement';

/** «Операція» of a journal row: an issue says whether it went to a production task. */
export function movementOperationLabel(row: FabricMovementRow): string {
  switch (row.kind) {
    case 'Issue':
      return row.orderId !== null ? 'На завдання' : 'Разова витрата';
    case 'Opening':
      return 'Початковий';
    case 'Receipt':
      return 'Прихід';
    case 'Adjustment':
      return 'Уточнення';
    case 'Reversal':
      return 'Сторно';
  }
}

/**
 * «Звідки / куди»: the task and model of an issue (`Ц-12 · Халат`), the supplier and document of a receipt,
 * «Куди використано» of a one-off issue, the reason of an adjustment; null where there is nothing to say.
 */
export function movementSource(row: FabricMovementRow): string | null {
  if (row.orderNumber !== null)
    return `Ц-${row.orderNumber}${row.modelName ? ` · ${row.modelName}` : ''}`;
  if (row.kind === 'Receipt' || row.kind === 'Opening') {
    const parts = [row.supplierName, row.document].filter(Boolean);
    return parts.length ? parts.join(' · ') : null;
  }
  if (row.kind === 'Issue') return row.destination ?? 'Без завдання';
  if (row.kind === 'Adjustment') return row.note;
  return null;
}

/** «Відмінено» marks of a row: a voided movement keeps no effect, a reversed one has its storno. */
export function movementCancelMark(row: FabricMovementRow): string | null {
  if (row.isVoided) return 'Прибрано з обліку';
  if (row.isReversed) return 'Сторновано';
  return null;
}
