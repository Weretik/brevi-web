import type { BookingPair } from '../../entities/reports/stock-reports';

const squash = (value: string) => value.normalize('NFC').toLocaleLowerCase('uk-UA').trim();

/**
 * «Бронь і що замовити» search: a part of the fabric, code, colour, client or order number (with or
 * without «Ц-» / «№»). A pair found by an order keeps only that order's rows. «Лише те, що потрібно
 * замовити» keeps the pairs with something to order.
 */
export function searchBooking(
  pairs: readonly BookingPair[],
  search: string,
  onlyToOrder: boolean,
): BookingPair[] {
  const term = squash(search).replace(/^(ц-|№)\s*/u, '');
  return pairs
    .filter((pair) => !onlyToOrder || pair.toOrder > 0)
    .flatMap((pair) => {
      if (!term) return [pair];
      const ofPair = [pair.fabricCode, pair.fabricName, pair.color].some((x) =>
        squash(x).includes(term),
      );
      if (ofPair) return [pair];
      const items = pair.items.filter(
        (item) => squash(item.clientName).includes(term) || String(item.orderNumber) === term,
      );
      return items.length > 0 ? [{ ...pair, items }] : [];
    });
}
