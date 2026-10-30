import { describe, expect, it } from 'vitest';

import { adminRouteDefinitions } from './admin-route-definitions';
import { createNavigation } from './navigation-config';

describe('legacy Admin navigation', () => {
  it('connects existing quote and archive entries to the shared quote routes', () => {
    const paths = new Set(adminRouteDefinitions.map((route) => route.path));
    const manager = createNavigation(paths, ['Admin']).find(
      (group) => group.id === 'service-manager',
    );
    expect(manager?.items.find((item) => item.id === 'quotes')?.to).toBe('/crm/quotes');
    expect(paths.has('/crm/quotes/new')).toBe(true);
    expect(paths.has('/crm/quotes/:quoteId')).toBe(true);
    expect(manager?.items.find((item) => item.id === 'quote-archive')?.to).toBe(
      '/crm/quotes/archive',
    );
    expect(paths.has('/crm/quotes/:quoteId/history')).toBe(true);
    expect(manager?.items.find((item) => item.id === 'issuer-settings')?.to).toBe(
      '/crm/issuer-settings',
    );
    expect(paths.has('/crm/issuer-settings')).toBe(true);
  });
  it('keeps 28 shared entries in the original five sections for Manager', () => {
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
  it('shows issuer settings only for the server Admin role', () => {
    const paths = new Set(['/crm/issuer-settings', '/crm/quotes']);
    const admin = createNavigation(paths, ['Admin']);
    const manager = createNavigation(paths, ['Manager']);
    const unknown = createNavigation(paths);
    expect(admin[0].items.find((item) => item.id === 'issuer-settings')?.to).toBe(
      '/crm/issuer-settings',
    );
    expect(manager[0].items.some((item) => item.id === 'issuer-settings')).toBe(false);
    expect(unknown[0].items.some((item) => item.id === 'issuer-settings')).toBe(false);
    expect(manager[0].items.find((item) => item.id === 'quotes')?.to).toBe('/crm/quotes');
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
