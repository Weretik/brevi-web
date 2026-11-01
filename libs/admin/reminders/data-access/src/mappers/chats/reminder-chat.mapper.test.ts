import { describe, expect, it } from 'vitest';

import { mapReminderChats } from './reminder-chat.mapper';
import { chatResponse } from '../../testing/reminder-fixtures';

describe('mapReminderChats', () => {
  it('maps discovered chats', () => {
    expect(mapReminderChats([chatResponse])).toEqual([
      {
        id: 3,
        kind: 'group',
        telegramTitle: 'Бухгалтерія Бреві',
        displayName: null,
        isApproved: false,
        isBotMember: true,
        discoveredAt: '2026-11-01T10:00:00+00:00',
      },
    ]);
  });
});
