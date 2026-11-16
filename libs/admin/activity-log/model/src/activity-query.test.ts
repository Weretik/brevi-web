import { describe, expect, it } from 'vitest';

import {
  activityActionLabel,
  activityRoleLabel,
  activitySubjectPath,
  formatActivityTime,
} from './activity-labels';
import {
  activityQueryFromParams,
  activityQueryIsFiltered,
  activityQueryToParams,
} from './activity-query';

describe('activity query and URL', () => {
  it('shows managers on the first page when the URL is empty', () => {
    const query = activityQueryFromParams(new URLSearchParams());

    expect(query).toEqual({ page: 1, pageSize: 50, role: 'Manager' });
    expect(activityQueryToParams(query).toString()).toBe('');
    expect(activityQueryIsFiltered(query)).toBe(false);
  });

  it('keeps «Усі ролі» and every filter in the URL', () => {
    const params = new URLSearchParams(
      'role=all&actor=7&type=quote&action=Changed&from=2026-11-01&to=2026-11-16&q=%20Фартух%20&page=2',
    );
    const query = activityQueryFromParams(params);

    expect(query).toEqual({
      page: 2,
      pageSize: 50,
      actorId: 7,
      subjectType: 'quote',
      action: 'Changed',
      from: '2026-11-01',
      to: '2026-11-16',
      search: 'Фартух',
    });
    expect(activityQueryToParams(query).toString()).toBe(
      'role=all&actor=7&type=quote&action=Changed&from=2026-11-01&to=2026-11-16&q=%D0%A4%D0%B0%D1%80%D1%82%D1%83%D1%85&page=2',
    );
    expect(activityQueryIsFiltered(query)).toBe(true);
  });

  it('ignores a broken page, person or date', () => {
    const query = activityQueryFromParams(new URLSearchParams('page=-1&actor=x&from=16.11.2026'));

    expect(query).toEqual({ page: 1, pageSize: 50, role: 'Manager' });
  });
});

describe('activity labels', () => {
  it('names actions and roles in Ukrainian and keeps unknown ones', () => {
    expect(activityActionLabel('Changed')).toBe('Змінено');
    expect(activityActionLabel('Moved')).toBe('Moved');
    expect(activityRoleLabel('Manager')).toBe('Менеджер');
    expect(activityRoleLabel('Комірник')).toBe('Комірник');
    expect(formatActivityTime('2026-11-16T12:30:00Z')).toBe('16.11.2026, 14:30');
  });

  it('links an object to its page unless the entry deleted it', () => {
    expect(activitySubjectPath({ action: 'Changed', subjectType: 'quote', subjectId: '12' })).toBe(
      '/crm/quotes/12',
    );
    expect(
      activitySubjectPath({ action: 'Deleted', subjectType: 'quote', subjectId: '12' }),
    ).toBeNull();
    expect(
      activitySubjectPath({ action: 'Created', subjectType: 'fabric', subjectId: '3' }),
    ).toBeNull();
  });
});
