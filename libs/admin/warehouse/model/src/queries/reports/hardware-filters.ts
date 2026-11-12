import type { HardwareNeed, HardwareReport } from '../../entities/reports/stock-reports';

const squash = (value: string) => value.normalize('NFC').toLocaleLowerCase('uk-UA').trim();

/** «Що замовити › Фурнітура» chips; only problems get their own chip. */
export const hardwareViews = ['all', 'incomplete', 'unchecked'] as const;
export type HardwareView = (typeof hardwareViews)[number];

export const hardwareViewLabels: Record<HardwareView, string> = {
  all: 'Усі',
  incomplete: 'Неповна потреба',
  unchecked: 'Назву не знайдено',
};

export const hardwareViewCounts = (report: HardwareReport): Record<HardwareView, number> => ({
  all: report.needs.length,
  incomplete: report.incomplete.length,
  unchecked: report.needs.filter((x) => !x.nameChecked).length,
});

/**
 * Needs of a chip found by the search over code, name, note, client and task number (with or without «Ц-» / «№»),
 * the nearest due date first (needs without a date last), then by code.
 */
export function filterHardware(
  needs: readonly HardwareNeed[],
  view: Exclude<HardwareView, 'incomplete'>,
  search: string,
): HardwareNeed[] {
  const term = squash(search).replace(/^(ц-|№)\s*/u, '');
  return needs
    .filter((need) => view === 'all' || !need.nameChecked)
    .filter(
      (need) =>
        !term ||
        [need.code, need.name, need.note ?? ''].some((x) => squash(x).includes(term)) ||
        need.orders.some(
          (x) => squash(x.clientName).includes(term) || String(x.orderNumber) === term,
        ),
    )
    .sort(
      (a, b) =>
        (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999') || a.code.localeCompare(b.code),
    );
}
