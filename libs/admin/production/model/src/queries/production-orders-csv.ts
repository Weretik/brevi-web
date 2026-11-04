import { productionOrderStatusLabels } from '../entities/production-order';
import { productionStageLabels } from '../entities/production-tracking';
import { formatDay } from '../mappers/format-production';

import type { ProductionOrderSummary } from '../entities/production-order';

const columns: [string, (row: ProductionOrderSummary) => string | number][] = [
  ['Номер', (row) => row.number],
  ['Статус', (row) => productionOrderStatusLabels[row.status]],
  ['Етап', (row) => productionStageLabels[row.stage]],
  ['Клієнт', (row) => row.clientName],
  ['КП', (row) => row.quoteNumber ?? ''],
  ['Менеджер', (row) => row.managerName],
  ['Дата створення', (row) => formatDay(row.orderDate)],
  ['Позицій', (row) => row.itemsCount],
  ['Кількість', (row) => row.totalQuantity],
  ['Найближче «Готово до»', (row) => (row.nearestDueDate ? formatDay(row.nearestDueDate) : '')],
];

const cell = (value: string | number) => {
  const text = String(value);
  return /[";\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

/**
 * The list as a CSV that Excel opens with Ukrainian letters: a BOM, «;» between cells (the
 * Ukrainian Excel default) and CRLF line ends.
 */
export function productionOrdersCsv(rows: readonly ProductionOrderSummary[]): string {
  const lines = [
    columns.map(([title]) => cell(title)).join(';'),
    ...rows.map((row) => columns.map(([, value]) => cell(value(row))).join(';')),
  ];
  return `﻿${lines.join('\r\n')}\r\n`;
}
