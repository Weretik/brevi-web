import { describe, expect, it } from 'vitest';

import { mapProgressImportResult, mapWorkshopSettings } from './production-tracking.mapper';

describe('production tracking mappers', () => {
  it('keeps negative Telegram group ids', () => {
    const settings = mapWorkshopSettings({
      telegramEnabled: true,
      telegramChatId: -1003339287606,
      telegramThreadId: 434,
      botConfigured: true,
      chats: [{ chatId: -1003339287606, title: 'Цех' }],
      updatedByName: null,
      updatedAt: null,
    });
    expect(settings.telegramChatId).toBe(-1003339287606);
    expect(settings.chats[0].title).toBe('Цех');
  });

  it('shows the moved progress as «№ N» with what changes', () => {
    const result = mapProgressImportResult({
      dryRun: true,
      updated: 1,
      unchanged: 0,
      errors: 1,
      lines: [
        { number: 7, legacyId: 'a', stages: 2, files: 3, action: 'updated', error: null },
        { number: null, legacyId: 'b', stages: 0, files: 0, action: 'error', error: 'Немає' },
      ],
    });
    expect(result.lines[0]).toMatchObject({ key: '№ 7', detail: 'Етапів: 2 · Файлів: 3' });
    expect(result.lines[1]).toMatchObject({ key: 'b', action: 'error' });
  });
});
