import type { PayrollLine, PayrollMonth } from '../../entities/people/payroll';

const decimal = (value: number | null) => (value === null ? '' : String(value).replace('.', ','));

const cell = (value: string | number) => {
  const text = String(value);
  return /[";\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const columns: [string, (line: PayrollLine) => string | number][] = [
  ['Працівник', (line) => line.name],
  ['Посада', (line) => line.position],
  ['Години', (line) => decimal(Math.round((line.minutes / 60) * 100) / 100)],
  ['Пошив, шт.', (line) => line.sewn],
  ['Пошив, грн', (line) => decimal(line.sewing)],
  ['Крій, шт.', (line) => line.cut],
  ['Крій, грн', (line) => decimal(line.cutting)],
  ['Премія, грн', (line) => decimal(line.bonus)],
  ['Майстер, грн', (line) => decimal(line.master)],
  ['Начальник, грн', (line) => decimal(line.chief)],
  ['Вишивка, грн', (line) => decimal(line.embroidery)],
  ['Інше, грн', (line) => decimal(line.other)],
  ['Нараховано, грн', (line) => decimal(line.accrued)],
  ['Виплачено, грн', (line) => decimal(line.paid)],
  ['До видачі, грн', (line) => decimal(line.due)],
  ['Видано, грн', (line) => decimal(line.issued)],
];

/**
 * «Нарахування працівникам» of a month as a CSV that Ukrainian Excel opens as a table: a BOM, «;» between
 * cells, decimal commas.
 */
export function payrollCsv(month: PayrollMonth): string {
  const lines = [
    columns.map(([title]) => cell(title)).join(';'),
    ...month.lines.map((line) => columns.map(([, value]) => cell(value(line))).join(';')),
  ];
  return `﻿${lines.join('\r\n')}\r\n`;
}
