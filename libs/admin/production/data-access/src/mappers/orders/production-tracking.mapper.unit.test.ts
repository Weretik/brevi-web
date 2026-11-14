import { describe, expect, it } from 'vitest';

import {
  mapProgressImportResult,
  mapReportPriceImportResult,
  mapWorkshopSettings,
} from './production-tracking.mapper';

describe('production tracking mappers', () => {
  it('keeps negative Telegram group ids', () => {
    const settings = mapWorkshopSettings({
      telegramEnabled: true,
      telegramChatId: -1001234567890,
      telegramThreadId: 434,
      botConfigured: true,
      chats: [{ chatId: -1001234567890, title: 'Цех' }],
      updatedByName: null,
      updatedAt: null,
    });
    expect(settings.telegramChatId).toBe(-1001234567890);
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

  it('shows the moved КП prices as «№ N» with how many items take one', () => {
    const result = mapReportPriceImportResult({
      dryRun: true,
      updated: 1,
      unchanged: 0,
      errors: 0,
      lines: [{ number: 7, legacyId: 'a', prices: 2, action: 'updated', error: null }],
    });
    expect(result.lines[0]).toMatchObject({ key: '№ 7', detail: 'Позицій з ціною: 2' });
  });
});
