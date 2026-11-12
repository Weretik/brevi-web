import type { FabricStockLastMovement } from '../../entities/stock/fabric-stock';

const shortDay = (day: string) => `${day.slice(8, 10)}.${day.slice(5, 7)}`;

/** «Остання операція» of a pair: `Ц-14 · 11.11`, `прихід ВН-3201 · 03.11`, `уточнення · 09.11`. */
export function stockLastMovementLabel(last: FabricStockLastMovement): string {
  const what = (() => {
    switch (last.kind) {
      case 'Issue':
        return last.orderNumber !== null
          ? `Ц-${last.orderNumber}`
          : (last.destination ?? 'разова витрата');
      case 'Receipt':
        return last.document ? `прихід ${last.document}` : 'прихід';
      case 'Opening':
        return 'початковий';
      case 'Adjustment':
        return 'уточнення';
      case 'Reversal':
        return 'сторно';
    }
  })();
  return `${what} · ${shortDay(last.operationDate)}`;
}
