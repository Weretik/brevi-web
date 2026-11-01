import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ReminderOccurrenceHistory } from './reminder-occurrence-history';

afterEach(cleanup);

describe('ReminderOccurrenceHistory', () => {
  it('lists who pressed what, newest first', () => {
    const actor = { name: 'Олена', telegramUserId: 1, adminUserId: null };
    render(
      <ReminderOccurrenceHistory
        actions={[
          { kind: 'postponed', actor, at: '2026-11-03T07:00:00Z', snoozedUntil: '2026-11-05' },
          { kind: 'done', actor, at: '2026-11-05T07:30:00Z', snoozedUntil: null },
        ]}
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Виконано');
    expect(items[0]).toHaveTextContent('05.11.2026, 09:30');
    expect(items[1]).toHaveTextContent('Перенесено до 05.11.2026');
  });
});
