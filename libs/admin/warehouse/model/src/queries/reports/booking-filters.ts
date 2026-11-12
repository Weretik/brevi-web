import type { BookingPair, BookingReport } from '../../entities/reports/stock-reports';

const squash = (value: string) => value.normalize('NFC').toLocaleLowerCase('uk-UA').trim();

/** «Що замовити › Тканина» chips: what to order (the default), every pair, or the items whose plan is unknown. */
export const bookingViews = ['toOrder', 'all', 'unknown'] as const;
export type BookingView = (typeof bookingViews)[number];

export const bookingViewLabels: Record<BookingView, string> = {
  toOrder: 'Замовити',
  all: 'Усі пари',
  unknown: 'Без плану',
};

/** A «Потрібно до» this many days away or sooner is marked red. */
export const BOOKING_SOON_DAYS = 3;

/**
 * The search: a part of the fabric, code, colour, supplier, client or task number (with or without «Ц-» / «№»).
 * A pair found by a task keeps only that task's rows.
 */
export function searchBooking(pairs: readonly BookingPair[], search: string): BookingPair[] {
  const term = squash(search).replace(/^(ц-|№)\s*/u, '');
  if (!term) return [...pairs];
  return pairs.flatMap((pair) => {
    const ofPair = [pair.fabricCode, pair.fabricName, pair.color, pair.supplier ?? ''].some((x) =>
      squash(x).includes(term),
    );
    if (ofPair) return [pair];
    const items = pair.items.filter(
      (item) => squash(item.clientName).includes(term) || String(item.orderNumber) === term,
    );
    return items.length > 0 ? [{ ...pair, items }] : [];
  });
}

/** Pairs of each chip under the supplier filter. */
export function bookingViewCounts(
  report: BookingReport,
  supplier: string | null,
): Record<BookingView, number> {
  const pairs = report.pairs.filter((x) => supplier === null || x.supplier === supplier);
  return {
    toOrder: pairs.filter((x) => x.toOrder > 0).length,
    all: pairs.length,
    unknown: report.unknown.length,
  };
}

/** Suppliers of the pairs, for the supplier chip. */
export const bookingSuppliers = (pairs: readonly BookingPair[]) =>
  [...new Set(pairs.map((x) => x.supplier).filter((x): x is string => Boolean(x)))].sort((a, b) =>
    a.localeCompare(b, 'uk'),
  );

/**
 * The pairs of a chip and a supplier found by the search, the nearest «Потрібно до» first (pairs without a date
 * last), then the most to order.
 */
export function filterBooking(
  pairs: readonly BookingPair[],
  view: Exclude<BookingView, 'unknown'>,
  supplier: string | null,
  search: string,
): BookingPair[] {
  const shown = pairs.filter(
    (x) => (view === 'all' || x.toOrder > 0) && (supplier === null || x.supplier === supplier),
  );
  return searchBooking(shown, search).sort(
    (a, b) =>
      (a.needBy ?? '9999').localeCompare(b.needBy ?? '9999') ||
      b.toOrder - a.toOrder ||
      a.fabricName.localeCompare(b.fabricName, 'uk') ||
      a.color.localeCompare(b.color, 'uk'),
  );
}

/** «Замовити X м · N пар · M постачальники» of the pairs with something to order. */
export function bookingToOrderSummary(pairs: readonly BookingPair[]) {
  const toOrder = pairs.filter((x) => x.toOrder > 0);
  return {
    meters: toOrder.reduce((sum, x) => sum + x.toOrder, 0),
    pairs: toOrder.length,
    suppliers: bookingSuppliers(toOrder).length,
  };
}

/** How much of the need the stock covers, 0…1; a pair without need is covered. */
export const bookingCoverage = (pair: BookingPair) =>
  pair.need <= 0 ? 1 : Math.min(1, Math.max(0, pair.reserved / pair.need));

/** Whether a day «yyyy-mm-dd» is in the past or within {@link BOOKING_SOON_DAYS} days of today. */
export function isDueSoon(day: string | null, today: string): boolean {
  if (!day) return false;
  const days = (Date.parse(`${day}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000;
  return days <= BOOKING_SOON_DAYS;
}
