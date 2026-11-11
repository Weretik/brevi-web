import { xlsxWorkbook } from './xlsx-workbook';
import { fabricMovementKindLabels } from '../../entities/movements/fabric-movement';
import { formatDay, formatKyivTime } from '../format/warehouse-format';

import type { FabricMovementRow } from '../../entities/movements/fabric-movement';
import type { FabricStockList } from '../../entities/stock/fabric-stock';

/**
 * «Завантажити всі залишки Excel»: the whole merged stock whatever the search shows. Code, name,
 * composition, density, colour and metres, with the Kyiv export time, the count and the total.
 */
export function stockBalancesWorkbook(stock: FabricStockList, now = new Date()): Uint8Array {
  const rows = stock.fabrics.flatMap((fabric) =>
    fabric.colors.map((color) => [
      fabric.fabricCode,
      fabric.fabricName,
      fabric.composition,
      fabric.density,
      color.color,
      color.meters,
    ]),
  );
  return xlsxWorkbook([
    {
      name: 'Залишки',
      info: [
        ['Залишки тканин', `Вивантажено ${formatKyivTime(now)} (Київ)`],
        ['Позицій', rows.length, 'Разом, м', stock.meters],
      ],
      header: ['Код', 'Тканина', 'Склад', 'Щільність', 'Колір', 'Залишок, м'],
      rows,
      widths: [12, 36, 28, 14, 22, 14],
    },
  ]);
}

/** Where the fabric went: the order, the «Куди використано» of a one-off issue, or the supplier. */
export function movementTarget(row: FabricMovementRow): string | null {
  if (row.orderNumber !== null)
    return `Завдання №${row.orderNumber}${row.modelName ? ` · ${row.modelName}` : ''}`;
  if (row.kind === 'Issue') return row.destination ?? 'Разова витрата';
  return null;
}

/** «Вивантажити рух в Excel»: every page of the current filter. */
export function movementsWorkbook(rows: readonly FabricMovementRow[], now = new Date()) {
  return xlsxWorkbook([
    {
      name: 'Рух тканини',
      info: [['Рух тканини', `Вивантажено ${formatKyivTime(now)} (Київ)`, 'Рядків', rows.length]],
      header: [
        'Дата операції',
        'Записано',
        'Вид',
        'Код',
        'Тканина',
        'Колір',
        'Постачальник',
        'Документ',
        'Замовлення / куди',
        'Прихід, м',
        'Витрата, м',
        'На 1 виріб, м',
        'Залишок рядка, м',
        'Хто записав',
        'Примітка',
        'Сторновано',
      ],
      rows: rows.map((row) => [
        formatDay(row.operationDate),
        formatKyivTime(row.createdAt),
        fabricMovementKindLabels[row.kind],
        row.fabricCode,
        row.fabricName,
        row.color,
        row.supplierName,
        row.document,
        movementTarget(row),
        row.delta > 0 ? row.delta : null,
        row.delta < 0 ? -row.delta : null,
        row.perProduct,
        row.metersAfter,
        row.createdByName,
        row.note,
        row.isReversed ? 'так' : null,
      ]),
      widths: [13, 17, 18, 11, 30, 18, 22, 16, 28, 11, 11, 12, 14, 22, 30, 11],
    },
  ]);
}
