import { hardwareUnitLabel } from '@admin/warehouse/model';

import type { BookingReport, HardwareReport } from '@admin/warehouse/model';

/** A line of a shortage block: only what is missing, with the reason. */
export interface ShortageRow {
  key: string;
  name: string;
  note: string;
  tone: 'error' | 'warning';
}

export interface ShortageList {
  rows: ShortageRow[];
  /** Lines left out of the block; the full list is on the report page. */
  more: number;
}

export interface HardwareRow {
  key: string;
  name: string;
  quantity: string;
}

export interface HardwareList {
  rows: HardwareRow[];
  more: number;
}

const blockSize = 5;

const amount = (value: number) =>
  value.toLocaleString('uk-UA', { maximumFractionDigits: 2, minimumFractionDigits: 0 });

/**
 * «Не вистачає тканини» from «Бронь і що замовити»: pairs to order (red) and pairs already below zero (amber), the
 * largest first. Pairs with enough fabric are not listed.
 */
export function fabricShortages(report: BookingReport): ShortageList {
  const rows = report.pairs
    .filter((pair) => pair.toOrder > 0 || pair.shortage > 0)
    .sort((a, b) => b.toOrder - a.toOrder || b.shortage - a.shortage)
    .map<ShortageRow>((pair) => ({
      key: `${pair.fabricCode}|${pair.color}`,
      name: `${pair.fabricName}, ${pair.color}`,
      note:
        pair.toOrder > 0
          ? `замовити ${amount(pair.toOrder)} м`
          : `мінус ${amount(pair.shortage)} м`,
      tone: pair.toOrder > 0 ? 'error' : 'warning',
    }));
  return { rows: rows.slice(0, blockSize), more: Math.max(0, rows.length - blockSize) };
}

/** «Фурнітура до замовлення»: the largest needs first. */
export function hardwareToOrder(report: HardwareReport): HardwareList {
  const rows = [...report.needs]
    .sort((a, b) => b.quantity - a.quantity)
    .map<HardwareRow>((need) => ({
      key: `${need.code}|${need.unit}`,
      name: need.name,
      quantity: `${amount(need.quantity)} ${hardwareUnitLabel(need.unit)}`,
    }));
  return { rows: rows.slice(0, blockSize), more: Math.max(0, rows.length - blockSize) };
}
