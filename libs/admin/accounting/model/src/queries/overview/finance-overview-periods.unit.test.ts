import { describe, expect, it } from 'vitest';

import { financePeriodCaption, financePeriodChoices } from './finance-overview-periods';

describe('financePeriodChoices', () => {
  it('offers this month, the last month and the whole current books', () => {
    expect(financePeriodChoices('Current', '2026-10-01', '2026-11-05')).toEqual([
      {
        key: 'month',
        from: '2026-11-01',
        to: '2026-11-05',
        label: 'Листопад',
        caption: 'листопад',
      },
      {
        key: 'previousMonth',
        from: '2026-10-01',
        to: '2026-10-31',
        label: 'Жовтень',
        caption: 'жовтень',
      },
      {
        key: 'all',
        from: '2026-10-01',
        to: '2026-11-05',
        label: 'З 01.10',
        caption: 'з 01.10.2026',
      },
    ]);
  });

  it('starts at the cutover and leaves out a month before it', () => {
    const choices = financePeriodChoices('Current', '2026-10-15', '2026-10-20');
    expect(choices.map((choice) => [choice.key, choice.from, choice.to])).toEqual([
      ['month', '2026-10-15', '2026-10-20'],
      ['all', '2026-10-15', '2026-10-20'],
    ]);
  });

  it('crosses the new year', () => {
    const [, previous] = financePeriodChoices('Current', '2025-01-01', '2026-01-10');
    expect(previous).toMatchObject({ from: '2025-12-01', to: '2025-12-31', label: 'Грудень' });
  });

  it('gives the archive one whole period', () => {
    expect(financePeriodChoices('LegacyArchive', '2026-10-01', '2026-11-05')).toEqual([
      {
        key: 'all',
        from: '2010-01-01',
        to: '2026-09-30',
        label: 'Увесь архів',
        caption: 'до 30.09.2026',
      },
    ]);
    expect(financePeriodCaption({ from: '2026-10-01', to: '2026-10-15' })).toBe(
      '01.10.2026 – 15.10.2026',
    );
  });
});
