import { describe, expect, it } from 'vitest';

import { hardwareWorkbook } from './hardware-exports';

const text = (bytes: Uint8Array) => new TextDecoder().decode(bytes);

describe('hardwareWorkbook', () => {
  it('has the summary and the shares by order, with incomplete lines and names to check', () => {
    const body = text(
      hardwareWorkbook({
        orders: 1,
        items: 1,
        calculatedAt: '2026-11-11T10:00:00Z',
        needs: [
          {
            code: 'FUR-007',
            name: 'FUR-007',
            nameChecked: false,
            note: null,
            unit: 'Piece',
            quantity: 6,
            orders: [
              {
                orderId: 1,
                orderNumber: 12,
                clientName: 'Геофізика',
                itemId: 3,
                modelName: 'Куртка',
                norm: 2,
                products: 3,
                quantity: 6,
              },
            ],
          },
        ],
        incomplete: [
          {
            orderId: 1,
            orderNumber: 12,
            clientName: 'Геофізика',
            itemId: 3,
            modelName: 'Куртка',
            code: 'FUR-040',
            name: 'Нова позиція',
            reason: 'Не визначено, чи це фурнітура: кількість не порахована.',
          },
        ],
      }),
    );
    expect(body).toContain('name="Зведена потреба"');
    expect(body).toContain('name="За замовленнями"');
    expect(body).toContain('Потрібна перевірка назви');
    expect(body).toContain('Потреба неповна: Не визначено');
    expect(body).toContain('<v>6</v>');
  });
});
