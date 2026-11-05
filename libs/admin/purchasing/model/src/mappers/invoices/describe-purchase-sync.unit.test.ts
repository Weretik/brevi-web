import { describe, expect, it } from 'vitest';

import { describePurchaseSync } from './describe-purchase-sync';

const base = {
  recordCount: 740,
  fileCount: 738,
  messagesAdded: 0,
  messagesUpdated: 0,
  rowsAdded: 0,
  rowsUpdated: 0,
  rowsDeactivated: 0,
  filesAdded: 0,
  filesDeactivated: 0,
  syncedAt: '2026-11-05T08:00:00Z',
};

describe('describePurchaseSync', () => {
  it('says nothing changed', () => {
    expect(describePurchaseSync(base)).toBe(
      'Реєстр оновлено, змін немає. Усього 740 рядків у таблиці.',
    );
  });

  it('lists only what changed', () => {
    expect(
      describePurchaseSync({ ...base, recordCount: 741, messagesAdded: 1, rowsDeactivated: 2 }),
    ).toBe(
      'Реєстр оновлено: нових повідомлень: 1, зникли з таблиці рядків: 2. Усього 741 рядок у таблиці.',
    );
  });
});
