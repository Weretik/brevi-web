import { describe, expect, it } from 'vitest';

import {
  bookingCoverage,
  bookingToOrderSummary,
  bookingViewCounts,
  filterBooking,
  isDueSoon,
  searchBooking,
} from './booking-filters';

import type { BookingItem, BookingPair } from '../../entities/reports/stock-reports';

const item = (orderNumber: number, clientName: string): BookingItem => ({
  orderId: orderNumber,
  orderNumber,
  clientName,
  itemId: orderNumber * 10,
  modelName: 'Куртка',
  dueDate: null,
  layer: 'Upper',
  plan: 5,
  covered: 0,
  remaining: 5,
  reserved: 5,
  toOrder: 0,
});

const pair = (
  color: string,
  toOrder: number,
  items: BookingItem[],
  extra: Partial<BookingPair> = {},
): BookingPair => ({
  fabricCode: 'FAB-023',
  fabricName: 'Грета',
  color,
  stock: 10,
  need: 10,
  reserved: 10 - toOrder,
  free: 0,
  toOrder,
  shortage: 0,
  supplier: 'Тексика',
  needBy: null,
  items,
  ...extra,
});

const pairs = [
  pair('Синій', 0, [item(12, 'Геофізика'), item(14, 'Нафтогаз')]),
  pair('Чорний', 3, [item(15, 'Укрзалізниця')], { needBy: '2026-11-20' }),
  pair('Білий', 5, [item(16, 'Пошта')], { needBy: '2026-11-14', supplier: 'Черкаси' }),
  pair('Сірий', 8, [item(17, 'Пошта')]),
];

describe('searchBooking', () => {
  it('finds a pair by fabric, colour or supplier and keeps all its rows', () => {
    expect(searchBooking(pairs, 'грета')).toHaveLength(4);
    expect(searchBooking(pairs, 'син')[0]?.items).toHaveLength(2);
    expect(searchBooking(pairs, 'черкаси').map((x) => x.color)).toEqual(['Білий']);
  });

  it('finds a task by client or number and keeps only its rows', () => {
    expect(searchBooking(pairs, 'нафто')[0]?.items.map((x) => x.orderNumber)).toEqual([14]);
    expect(searchBooking(pairs, 'Ц-12')[0]?.items.map((x) => x.orderNumber)).toEqual([12]);
    expect(searchBooking(pairs, 'немає')).toEqual([]);
  });
});

describe('filterBooking', () => {
  it('«Замовити» keeps what to order, the nearest date first and undated last by metres', () => {
    expect(filterBooking(pairs, 'toOrder', null, '').map((x) => x.color)).toEqual([
      'Білий',
      'Чорний',
      'Сірий',
    ]);
  });

  it('«Усі пари» and a supplier', () => {
    expect(filterBooking(pairs, 'all', null, '')).toHaveLength(4);
    expect(filterBooking(pairs, 'all', 'Черкаси', '').map((x) => x.color)).toEqual(['Білий']);
  });

  it('counts the chips under the supplier', () => {
    const report = {
      reserved: 0,
      free: 0,
      toOrder: 16,
      pairs,
      unknown: [],
      calculatedAt: '2026-11-12T10:00:00Z',
      canReceive: true,
    };
    expect(bookingViewCounts(report, null)).toEqual({ toOrder: 3, all: 4, unknown: 0 });
    expect(bookingViewCounts(report, 'Тексика')).toEqual({ toOrder: 2, all: 3, unknown: 0 });
  });
});

describe('figures', () => {
  it('sums what to order with its pairs and suppliers', () => {
    expect(bookingToOrderSummary(pairs)).toEqual({ meters: 16, pairs: 3, suppliers: 2 });
  });

  it('coverage is the booked part of the need', () => {
    expect(bookingCoverage(pairs[1] as BookingPair)).toBeCloseTo(0.7);
    expect(bookingCoverage(pair('x', 0, [], { need: 0, reserved: 0 }))).toBe(1);
  });

  it('a due date is soon within three days or already past', () => {
    expect(isDueSoon('2026-11-15', '2026-11-12')).toBe(true);
    expect(isDueSoon('2026-11-10', '2026-11-12')).toBe(true);
    expect(isDueSoon('2026-11-16', '2026-11-12')).toBe(false);
    expect(isDueSoon(null, '2026-11-12')).toBe(false);
  });
});
