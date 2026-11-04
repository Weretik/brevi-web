import {
  embroideryBasisLabels,
  formatEmbroideryMinutes,
  formatEmbroideryNumber,
} from '@admin/embroidery/model';

import type { EmbroideryCostRow } from '@admin/embroidery/model';

/** What a cost row is multiplied by, as the person reads it: «500 × 1000 стежків», «50 зап’ялювань». */
export function embroideryCostBase(row: EmbroideryCostRow): string {
  const quantity = formatEmbroideryNumber(row.quantity);
  switch (row.kind) {
    case 'Stitches':
    case 'Threads':
      return `${quantity} × 1000 стежків`;
    case 'Hooping':
      return `${quantity} зап’ялювань`;
    case 'Stabilizer':
    case 'Fabric':
      return `${quantity} заготовок`;
    case 'Program':
      return row.quantity > 0 ? formatEmbroideryMinutes(row.quantity) : 'готова';
    default:
      if (row.basis === 'Order') return 'раз на замовлення';
      if (row.basis === 'Stitches') return `${quantity} × 1000 стежків`;
      if (row.basis === 'Hoop') return `${quantity} зап’ялювань`;
      if (row.basis === 'MachineHour') return `${quantity} год машини`;
      return row.basis ? `${quantity} · ${embroideryBasisLabels[row.basis]}` : quantity;
  }
}

/** Shares of the cost for the line under the total: work, materials, program, extras. */
export function embroideryCostShares(rows: readonly EmbroideryCostRow[], total: number): string {
  if (total <= 0) return '';
  const groups: [string, (row: EmbroideryCostRow) => boolean][] = [
    ['Робота', (row) => row.kind === 'Stitches' || row.kind === 'Hooping'],
    ['Нитки і матеріали', (row) => ['Threads', 'Stabilizer', 'Fabric'].includes(row.kind)],
    ['Програма', (row) => row.kind === 'Program'],
    ['Додаткові', (row) => row.kind === 'Extra'],
  ];
  return groups
    .map(([name, belongs]) => {
      const amount = rows.filter(belongs).reduce((sum, row) => sum + row.amount, 0);
      return amount > 0 ? `${name} ${Math.round((amount / total) * 100)}%` : null;
    })
    .filter(Boolean)
    .join(' · ');
}
