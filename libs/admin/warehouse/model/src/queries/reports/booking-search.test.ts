import { describe, expect, it } from 'vitest';

import { searchBooking } from './booking-search';

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

const pair = (color: string, toOrder: number, items: BookingItem[]): BookingPair => ({
  fabricCode: 'FAB-023',
  fabricName: 'Грета',
  color,
  stock: 10,
  need: 10,
  reserved: 10,
  free: 0,
  toOrder,
  shortage: 0,
  items,
});

const pairs = [
  pair('Синій', 0, [item(12, 'Геофізика'), item(14, 'Нафтогаз')]),
  pair('Чорний', 3, [item(15, 'Укрзалізниця')]),
];

describe('searchBooking', () => {
  it('finds a pair by fabric or colour and keeps all its rows', () => {
    expect(searchBooking(pairs, 'грета', false)).toHaveLength(2);
    expect(searchBooking(pairs, 'син', false)[0]?.items).toHaveLength(2);
  });

  it('finds an order by client or number and keeps only its rows', () => {
    expect(searchBooking(pairs, 'нафто', false)[0]?.items.map((x) => x.orderNumber)).toEqual([14]);
    expect(searchBooking(pairs, 'Ц-12', false)[0]?.items.map((x) => x.orderNumber)).toEqual([12]);
    expect(searchBooking(pairs, 'немає', false)).toEqual([]);
  });

  it('«Лише те, що потрібно замовити» keeps the pairs with something to order', () => {
    expect(searchBooking(pairs, '', true).map((x) => x.color)).toEqual(['Чорний']);
  });
});
