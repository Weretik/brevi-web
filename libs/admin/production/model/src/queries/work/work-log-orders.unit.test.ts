import { describe, expect, it } from 'vitest';

import { workLogOrderOptions } from './work-log-orders';

describe('workLogOrderOptions', () => {
  it('joins the orders of the log and the open orders once, sorted by label', () => {
    const options = workLogOrderOptions(
      [
        { orderId: 2, orderNumber: 20, clientName: 'Школа' },
        { orderId: 2, orderNumber: 20, clientName: 'Школа' },
      ],
      [
        { orderId: 1, orderNumber: 10, clientName: 'Нива' },
        { orderId: 2, orderNumber: 20, clientName: 'Школа' },
      ],
    );

    expect(options).toEqual([
      { id: 1, label: '№ 10 · Нива' },
      { id: 2, label: '№ 20 · Школа' },
    ]);
  });
});
