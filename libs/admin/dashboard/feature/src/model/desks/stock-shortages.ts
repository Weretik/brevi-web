import { hardwareUnitLabel } from '@admin/warehouse/model';

import { toDeskList } from './desk-list';

import type { DeskList, DeskListRow } from './desk-list';
import type { BookingReport, HardwareReport } from '@admin/warehouse/model';

const amount = (value: number) =>
  value.toLocaleString('uk-UA', { maximumFractionDigits: 2, minimumFractionDigits: 0 });

/**
 * «Не вистачає тканини» from «Бронь і що замовити»: pairs to order (red) and pairs already below zero (amber), the
 * largest first. Pairs with enough fabric are not listed.
 */
export function fabricShortages(report: BookingReport): DeskList {
  return toDeskList(
    report.pairs
      .filter((pair) => pair.toOrder > 0 || pair.shortage > 0)
      .sort((a, b) => b.toOrder - a.toOrder || b.shortage - a.shortage)
      .map<DeskListRow>((pair) => ({
        key: `${pair.fabricCode}|${pair.color}`,
        name: `${pair.fabricName}, ${pair.color}`,
        mark:
          pair.toOrder > 0
            ? { text: `замовити ${amount(pair.toOrder)} м`, tone: 'error' }
            : { text: `мінус ${amount(pair.shortage)} м`, tone: 'warning' },
      })),
  );
}

/** «Фурнітура до замовлення»: the largest needs first. */
export function hardwareToOrder(report: HardwareReport): DeskList {
  return toDeskList(
    [...report.needs]
      .sort((a, b) => b.quantity - a.quantity)
      .map<DeskListRow>((need) => ({
        key: `${need.code}|${need.unit}`,
        name: need.name,
        value: `${amount(need.quantity)} ${hardwareUnitLabel(need.unit)}`,
      })),
  );
}
