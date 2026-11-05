import { describe, expect, it } from 'vitest';

import { adminRouteDefinitions } from './admin-route-definitions';
import { createNavigation } from './navigation-config';

describe('legacy Admin navigation', () => {
  it('links «КП» and «Налаштування КП»; later КП pages have no link', () => {
    const paths = new Set(adminRouteDefinitions.map((route) => route.path));
    const manager = createNavigation(paths, ['Admin']).find(
      (group) => group.id === 'service-manager',
    );
    expect(manager?.items.find((item) => item.id === 'quotes')?.to).toBe('/crm/quotes');
    expect(paths.has('/crm/quotes/new')).toBe(true);
    expect(paths.has('/crm/quotes/:quoteId')).toBe(true);
    expect(manager?.items.some((item) => item.id === 'quote-introductions')).toBe(false);
    expect(paths.has('/crm/quote-introductions/new')).toBe(true);
    expect(paths.has('/crm/quote-introductions/:quoteId')).toBe(true);
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
      'Нагадування',
      'Загальні довідники',
      'Фото',
      'Контент',
      'Загальні звіти',
    ]);
    expect(groups.map((group) => group.items.length)).toEqual([5, 4, 4, 8, 1, 2, 1]);
    expect(new Set(groups.flatMap((group) => group.items.map((item) => item.id))).size).toBe(25);
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
    expect(
      groups.find((group) => group.id === 'references')?.items.some((item) => item.id === 'media'),
    ).toBe(false);
  });

  it('enables a legacy URL only when the React route is registered', () => {
    const legacyPath = '/references/counterparties';
    const unavailable = createNavigation(new Set(['/']));
    const available = createNavigation(new Set(['/', legacyPath]));

    const references = (groups: typeof available) =>
      groups.find((group) => group.id === 'references')?.items[4];
    expect(references(unavailable)?.to).toBeUndefined();
    expect(references(available)?.to).toBe(legacyPath);
    expect(available[0].items[2].to).toBeUndefined();
  });

  it('shows «Користувачі», «Завдання менеджерам» and «Налаштування ШІ» only to Admin', () => {
    const paths = new Set(['/admin/users', '/admin/tasks', '/admin/ai']);
    const admin = createNavigation(paths, ['Admin']).find((group) => group.id === 'administration');

    expect(admin?.items).toEqual([
      { id: 'users', label: 'Користувачі', to: '/admin/users' },
      { id: 'manager-tasks', label: 'Завдання менеджерам', to: '/admin/tasks' },
      { id: 'ai-settings', label: 'Налаштування ШІ', to: '/admin/ai' },
    ]);
    expect(
      createNavigation(paths, ['Manager']).some((group) => group.id === 'administration'),
    ).toBe(false);
  });

  it('shows the «Швейний цех» pages to the head of the workshop and Admin only', () => {
    const paths = new Set([
      '/production/orders',
      '/production/fabric-stock',
      '/production/work',
      '/production/forecast',
      '/production/staff',
      '/production/fabric-norms',
      '/production/payroll-rules',
      '/production/payroll',
      '/production/timesheet',
      '/production/reports',
    ]);
    const shop = (roles: string[]) =>
      createNavigation(paths, roles).find((group) => group.id === 'sewing-shop');

    expect(
      shop(['WorkshopChief'])
        ?.items.slice(0, 7)
        .map((item) => item.to),
    ).toEqual([
      '/production/orders',
      '/production/fabric-stock',
      '/production/work',
      '/production/forecast',
      '/production/staff',
      '/production/fabric-norms',
      '/production/payroll-rules',
    ]);
    expect(shop(['Admin'])?.items[4].label).toBe('Працівники цеху');
    expect(
      shop(['WorkshopChief'])
        ?.items.filter((item) => item.id === 'salary' || item.id === 'work-time')
        .map((item) => item.to),
    ).toEqual(['/production/payroll', '/production/timesheet']);
    expect(shop(['Manager'])?.items.some((item) => item.id === 'workshop-staff')).toBe(false);
    expect(shop(['Manager'])?.items.some((item) => item.id === 'work-log')).toBe(false);
    expect(shop(['Manager'])?.items.some((item) => item.id === 'salary')).toBe(false);
    expect(shop(['Admin'])?.items.find((item) => item.id === 'workshop-reports')?.to).toBe(
      '/production/reports',
    );
    expect(shop(['WorkshopChief'])?.items.some((item) => item.id === 'workshop-reports')).toBe(
      false,
    );
    expect(shop(['Manager'])?.items[2]).toEqual({
      id: 'sewing-forecast',
      label: 'Прогноз пошиття',
      to: '/production/forecast',
    });
  });

  it('shows «Виробничі завдання» and «Склад тканин» to managers as well', () => {
    const paths = new Set(['/production/orders', '/production/fabric-stock']);
    const shop = createNavigation(paths, ['Manager']).find((group) => group.id === 'sewing-shop');

    expect(shop?.items[0]).toEqual({
      id: 'production-orders',
      label: 'Виробничі завдання',
      to: '/production/orders',
    });
    expect(shop?.items[1]).toEqual({
      id: 'fabric-stock',
      label: 'Склад тканин',
      to: '/production/fabric-stock',
    });
  });

  it('shows «Бухгалтерія» to the director only and links its two pages', () => {
    const paths = new Set(['/accounting/accounts', '/accounting/categories']);
    const accounting = (roles: string[]) =>
      createNavigation(paths, roles).find((group) => group.id === 'accounting');

    expect(accounting(['Director'])?.items.filter((item) => item.to)).toEqual([
      { id: 'finance-accounts', label: 'Рахунки і каси', to: '/accounting/accounts' },
      { id: 'finance-categories', label: 'Категорії', to: '/accounting/categories' },
    ]);
    expect(accounting(['Director'])?.items).toHaveLength(10);
    expect(accounting(['Admin'])).toBeUndefined();
    expect(accounting(['Accountant'])).toBeUndefined();
  });
});
