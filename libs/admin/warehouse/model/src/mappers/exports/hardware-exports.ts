import { xlsxWorkbook } from './xlsx-workbook';
import { hardwareUnitLabel } from '../../entities/reports/stock-reports';
import { formatKyivTime } from '../format/warehouse-format';

import type { HardwareReport } from '../../entities/reports/stock-reports';

/**
 * «Фурнітура до замовлення» in Excel (TZ §14.3): «Зведена потреба» with the same rows as the page,
 * and «За замовленнями» with each item's share, the lines whose quantity is unknown and the names
 * to check.
 */
export function hardwareWorkbook(report: HardwareReport, now = new Date()): Uint8Array {
  const exported = `Вивантажено ${formatKyivTime(now)} (Київ)`;
  const summary = report.needs.map((need) => [
    need.code,
    need.name,
    need.note,
    hardwareUnitLabel(need.unit),
    need.quantity,
    need.nameChecked ? null : 'Потрібна перевірка назви',
  ]);
  const byOrder = [
    ...report.needs.flatMap((need) =>
      need.orders.map((share) => [
        share.orderNumber,
        share.clientName,
        share.modelName,
        need.code,
        need.name,
        need.note,
        hardwareUnitLabel(need.unit),
        share.norm,
        share.products,
        share.quantity,
        need.nameChecked ? null : 'Потрібна перевірка назви',
      ]),
    ),
    ...report.incomplete.map((line) => [
      line.orderNumber,
      line.clientName,
      line.modelName,
      line.code,
      line.name,
      null,
      null,
      null,
      null,
      null,
      `Потреба неповна: ${line.reason}`,
    ]),
  ];
  return xlsxWorkbook([
    {
      name: 'Зведена потреба',
      info: [
        ['Фурнітура до замовлення', exported],
        ['Повна потреба відкритих замовлень. Складські залишки та видачі не віднімаються.'],
        ['Замовлень', report.orders, 'Позицій-моделей', report.items, 'Фурнітури', summary.length],
      ],
      header: ['Код', 'Фурнітура', 'Варіант / примітка', 'Одиниця', 'Потреба', 'Перевірка'],
      rows: summary,
      widths: [11, 36, 26, 10, 14, 26],
    },
    {
      name: 'За замовленнями',
      info: [['Фурнітура за замовленнями', exported, 'Рядків', byOrder.length]],
      header: [
        'Замовлення',
        'Замовник',
        'Модель',
        'Код',
        'Фурнітура',
        'Варіант / примітка',
        'Одиниця',
        'Норма на виріб',
        'Виробів',
        'Потреба',
        'Примітка',
      ],
      rows: byOrder,
      widths: [12, 26, 30, 11, 32, 22, 10, 14, 10, 12, 40],
    },
  ]);
}
