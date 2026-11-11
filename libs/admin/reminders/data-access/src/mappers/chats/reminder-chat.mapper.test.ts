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
        receivesSiteRequests: true,
        discoveredAt: '2026-11-01T10:00:00+00:00',
      },
    ]);
  });
});

describe('mapReminderChats before LEAD-002', () => {
  it('reads a missing «Заявки з сайту» choice as off', () => {
    const old: Record<string, unknown> = { ...chatResponse };
    delete old['receivesSiteRequests'];
    expect(mapReminderChats([old])[0]?.receivesSiteRequests).toBe(false);
  });
});
