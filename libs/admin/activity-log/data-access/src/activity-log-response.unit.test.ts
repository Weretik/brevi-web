import { describe, expect, it } from 'vitest';

import { mapActivityEntriesPage, mapActivityFilterOptions } from './activity-log-response';

const entry = {
  id: '0193f1c2-0000-7000-8000-000000000001',
  occurredAt: '2026-11-16T12:30:00+00:00',
  actorId: 7,
  actorName: 'Олена',
  actorRoles: ['Manager'],
  action: 'Changed',
  subjectType: 'quote',
  subjectTypeTitle: 'КП',
  subjectId: '12',
  subjectTitle: 'КП-1048',
  summary: null,
  changes: [{ field: 'Клієнт', from: null, to: 'ТОВ «Мрія»' }],
};

describe('activity log responses', () => {
  it('maps a page of entries', () => {
    expect(mapActivityEntriesPage({ items: [entry], page: 1, pageSize: 50, total: 1 })).toEqual({
      items: [entry],
      page: 1,
      pageSize: 50,
      total: 1,
    });
  });

  it('refuses an entry without its changes', () => {
    expect(() =>
      mapActivityEntriesPage({
        items: [{ ...entry, changes: undefined }],
        page: 1,
        pageSize: 50,
        total: 1,
      }),
    ).toThrow('Некоректна відповідь API журналу дій: зміни.');
  });

  it('maps the filter options', () => {
    expect(
      mapActivityFilterOptions({
        actors: [{ id: 7, name: 'Олена' }],
        subjectTypes: [{ key: 'quote', title: 'КП' }],
        actions: ['Created'],
      }),
    ).toEqual({
      actors: [{ id: 7, name: 'Олена' }],
      subjectTypes: [{ key: 'quote', title: 'КП' }],
      actions: ['Created'],
    });
  });
});
