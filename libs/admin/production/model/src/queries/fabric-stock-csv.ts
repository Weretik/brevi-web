import type { FabricStockRow } from '../entities/fabric-stock';

const decimal = (value: number | null) => (value === null ? '' : String(value).replace('.', ','));

const cell = (value: string | number) => {
  const text = String(value);
  return /[";\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

/**
 * Stock balances as a CSV that Ukrainian Excel opens as a table: a BOM, «;» between cells, decimal
 * commas. The value columns are there only for people who see the value.
 */
export function fabricStockCsv(rows: readonly FabricStockRow[], seesValue: boolean): string {
  const columns: [string, (row: FabricStockRow) => string | number][] = [
    ['Код', (row) => row.fabricCode],
    ['Тканина', (row) => row.fabricName],
    ['Колір', (row) => row.color],
    ['Залишок, м', (row) => decimal(row.meters)],
    ['Бронь, м', (row) => decimal(row.reserved)],
    ['Доступно, м', (row) => decimal(row.available)],
    ...(seesValue
      ? ([
          ['Ціна, грн/м', (row) => decimal(row.price)],
          ['Вартість, грн', (row) => decimal(row.value)],
        ] as [string, (row: FabricStockRow) => string | number][])
      : []),
  ];
  const lines = [
    columns.map(([title]) => cell(title)).join(';'),
    ...rows.map((row) => columns.map(([, value]) => cell(value(row))).join(';')),
  ];
  return `﻿${lines.join('\r\n')}\r\n`;
}
