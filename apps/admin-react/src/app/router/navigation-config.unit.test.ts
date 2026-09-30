import { describe, expect, it } from 'vitest';

import { createNavigation } from './navigation-config';

describe('legacy Admin navigation', () => {
  it('keeps 28 separate entries in the original five sections', () => {
    const groups = createNavigation(new Set(['/']));

    expect(groups.map((group) => group.label)).toEqual([
      'Менеджер сервісу',
      'Швейний цех',
      'Бухгалтерія',
      'Загальні довідники',
      'Загальні звіти',
    ]);
    expect(groups.map((group) => group.items.length)).toEqual([8, 7, 5, 7, 1]);
    expect(new Set(groups.flatMap((group) => group.items.map((item) => item.id))).size).toBe(28);
    expect(groups[0].items[2].id).not.toBe(groups[3].items[3].id);
  });

  it('enables the media link only with its registered route', () => {
    const groups = createNavigation(new Set(['/', '/references/media']));

    expect(groups[3].items[6]).toMatchObject({
      id: 'media',
      label: 'Медіа/Фото',
      to: '/references/media',
    });
  });

  it('enables a legacy URL only when the React route is registered', () => {
    const legacyPath = '/references/supplier';
    const unavailable = createNavigation(new Set(['/']));
    const available = createNavigation(new Set(['/', legacyPath]));

    expect(unavailable[3].items[3].to).toBeUndefined();
    expect(available[3].items[3].to).toBe(legacyPath);
    expect(available[0].items[2].to).toBeUndefined();
  });
});
