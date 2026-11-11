import { describe, expect, it } from 'vitest';

import { stockBalancesWorkbook } from './stock-exports';
import { xlsxWorkbook } from './xlsx-workbook';

const text = (bytes: Uint8Array) => new TextDecoder().decode(bytes);

describe('xlsx workbook', () => {
  it('is a zip with a frozen header, a filter and text that never becomes a formula', () => {
    const file = xlsxWorkbook([
      {
        name: 'Залишки',
        info: [['Вивантажено']],
        header: ['Тканина', 'Метри'],
        rows: [
          ['=HYPERLINK("x")', 12.5],
          ['@user', -3],
        ],
        widths: [20, 10],
      },
    ]);
    expect(Array.from(file.slice(0, 4))).toEqual([0x50, 0x4b, 0x03, 0x04]);
    const body = text(file);
    expect(body).toContain('<pane ySplit="2" topLeftCell="A3"');
    expect(body).toContain('<autoFilter ref="A2:B4"/>');
    expect(body).toContain(
      't="inlineStr"><is><t xml:space="preserve">=HYPERLINK(&quot;x&quot;)</t>',
    );
    expect(body).not.toContain('<f>');
    expect(body).toContain('<v>-3</v>');
  });

  it('exports every pair of the stock with the total', () => {
    const body = text(
      stockBalancesWorkbook(
        {
          fabrics: [
            {
              fabricCode: 'FAB-023',
              codes: ['FAB-023'],
              fabricName: 'Грета',
              composition: null,
              density: null,
              meters: 7,
              colors: [
                { color: 'Синій', colorKey: 'синій', meters: 4, version: 'a', sources: [] },
                { color: 'Чорний', colorKey: 'чорний', meters: 3, version: 'b', sources: [] },
              ],
            },
          ],
          meters: 7,
          pairs: 2,
          negative: 0,
          permissions: { canMove: true, seesValue: true },
        },
        new Date('2026-11-11T10:00:00Z'),
      ),
    );
    expect(body).toContain('12:00');
    expect(body).toContain('<autoFilter ref="A3:F5"/>');
    expect(body).toContain('Чорний');
  });
});
