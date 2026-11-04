import { describe, expect, it } from 'vitest';

import { adminRouteDefinitions } from './admin-route-definitions';
import { createNavigation } from './navigation-config';

describe('legacy Admin navigation', () => {
  it('links «КП» and «Налаштування КП» and keeps the later КП pages without a link', () => {
    const paths = new Set(adminRouteDefinitions.map((route) => route.path));
    const manager = createNavigation(paths, ['Admin']).find(
      (group) => group.id === 'service-manager',
    );
    expect(manager?.items.find((item) => item.id === 'quotes')?.to).toBe('/crm/quotes');
    expect(paths.has('/crm/quotes/new')).toBe(true);
    expect(paths.has('/crm/quotes/:quoteId')).toBe(true);
    expect(manager?.items.find((item) => item.id === 'quote-introductions')?.to).toBeUndefined();
    expect(manager?.items.find((item) => item.id === 'quote-settings')?.to).toBe(
      '/crm/quote-settings',
    );
    expect(paths.has('/crm/quotes/archive')).toBe(false);
    expect(paths.has('/crm/issuer-settings')).toBe(false);
  });
  it('connects the reminders group to its four pages', () => {
    const paths = new Set(adminRouteDefinitions.map((route) => route.path));
    const reminders = createNavigation(paths).find((group) => group.id === 'reminders');
    expect(reminders?.items.map((item) => item.to)).toEqual([
      '/reminders/tasks',
      '/reminders/periods',
      '/reminders/chats',
      '/reminders/non-working-days',
    ]);
  });
  it('keeps the shared entries in their sections, with reminders and site content', () => {
    const groups = createNavigation(new Set(['/']));

    expect(groups.map((group) => group.label)).toEqual([
      'Менеджер сервісу',
      'Швейний цех',
      'Бухгалтерія',
      'Нагадування',
      'Загальні довідники',
      'Фото',
      'Контент',
      'Загальні звіти',
    ]);
    expect(groups.map((group) => group.items.length)).toEqual([6, 7, 5, 4, 8, 1, 2, 1]);
    expect(new Set(groups.flatMap((group) => group.items.map((item) => item.id))).size).toBe(34);
    expect(groups[0].items.map((item) => item.id)).not.toContain('clients');
  });
  it('shows «Налаштування КП» only for the server Admin role', () => {
    const paths = new Set(['/crm/quotes']);
    const admin = createNavigation(paths, ['Admin']);
    const manager = createNavigation(paths, ['Manager']);
    expect(admin[0].items.some((item) => item.id === 'quote-settings')).toBe(true);
    expect(manager[0].items.some((item) => item.id === 'quote-settings')).toBe(false);
    expect(manager[0].items.find((item) => item.id === 'quotes')?.to).toBe('/crm/quotes');
  });

  it('shows the photo library as its own group with its registered route', () => {
    const groups = createNavigation(new Set(['/', '/media']));
    const media = groups.find((group) => group.id === 'media');

    expect(media).toMatchObject({ label: 'Фото', section: 'Дані' });
    expect(media?.items[0]).toMatchObject({
      id: 'media-library',
      label: 'Бібліотека фото',
      to: '/media',
    });
    expect(groups[4].items.some((item) => item.id === 'media')).toBe(false);
  });

  it('enables a legacy URL only when the React route is registered', () => {
    const legacyPath = '/references/counterparties';
    const unavailable = createNavigation(new Set(['/']));
    const available = createNavigation(new Set(['/', legacyPath]));

    expect(unavailable[4].items[4].to).toBeUndefined();
    expect(available[4].items[4].to).toBe(legacyPath);
    expect(available[0].items[2].to).toBeUndefined();
  });

  it('shows «Користувачі» and «Завдання менеджерам» only to the server Admin role', () => {
    const paths = new Set(['/admin/users', '/admin/tasks']);
    const admin = createNavigation(paths, ['Admin']).find((group) => group.id === 'administration');

    expect(admin?.items).toEqual([
      { id: 'users', label: 'Користувачі', to: '/admin/users' },
      { id: 'manager-tasks', label: 'Завдання менеджерам', to: '/admin/tasks' },
    ]);
    expect(
      createNavigation(paths, ['Manager']).some((group) => group.id === 'administration'),
    ).toBe(false);
  });
});
