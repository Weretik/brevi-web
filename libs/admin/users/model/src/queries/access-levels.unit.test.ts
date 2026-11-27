import { describe, expect, it } from 'vitest';

import {
  accessLevelOf,
  accessLevelsOf,
  groupAccessLevelOf,
  setAccessLevel,
  setGroupAccessLevel,
} from './access-levels';

import type { AccessArea } from '../entities/access-rights';

const area = (key: string, actions: AccessArea['actions']): AccessArea => ({
  key,
  group: 'Менеджер сервісу',
  title: key,
  actions,
  actionLabels: {},
});

const quotes = area('quotes', ['view', 'create', 'edit', 'delete']);
const tasks = area('tasks', ['view', 'edit']);
const forecast = area('forecast', ['view']);
const group = { title: 'Менеджер сервісу', areas: [quotes, tasks, forecast] };

describe('access levels (ACC-002)', () => {
  it('offers «Робота» only with create or edit and «Усе» only when the page deletes', () => {
    expect(accessLevelsOf(quotes)).toEqual(['none', 'view', 'work', 'all']);
    expect(accessLevelsOf(tasks)).toEqual(['none', 'view', 'work']);
    expect(accessLevelsOf(forecast)).toEqual(['none', 'view']);
  });

  it('gives create and edit for «Робота» and every action for «Усе»', () => {
    expect(setAccessLevel({}, quotes, 'work')).toEqual({ quotes: ['view', 'create', 'edit'] });
    expect(setAccessLevel({}, quotes, 'all')).toEqual({
      quotes: ['view', 'create', 'edit', 'delete'],
    });
    expect(setAccessLevel({ quotes: ['view'] }, quotes, 'none')).toEqual({});
  });

  it('names the level the rights match, or custom for actions picked one by one', () => {
    expect(accessLevelOf(quotes, {})).toBe('none');
    expect(accessLevelOf(quotes, { quotes: ['view', 'edit', 'create'] })).toBe('work');
    expect(accessLevelOf(quotes, { quotes: ['view', 'delete'] })).toBe('custom');
    expect(accessLevelOf(tasks, { tasks: ['view', 'edit'] })).toBe('work');
    expect(accessLevelOf(quotes, { quotes: ['edit'] })).toBe('none');
  });

  it('sets and reads a whole group at once', () => {
    const all = setGroupAccessLevel({ media: ['view'] }, group, 'all');
    expect(all).toEqual({
      media: ['view'],
      quotes: ['view', 'create', 'edit', 'delete'],
      tasks: ['view', 'edit'],
      forecast: ['view'],
    });
    expect(groupAccessLevelOf(group, all)).toBe('all');
    expect(groupAccessLevelOf(group, setGroupAccessLevel(all, group, 'view'))).toBe('view');
    expect(groupAccessLevelOf(group, setGroupAccessLevel(all, group, 'none'))).toBe('none');
    expect(groupAccessLevelOf(group, { quotes: ['view'] })).toBe('mixed');
  });
});
