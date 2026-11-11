import { describe, expect, it } from 'vitest';

import { adminRouteDefinitions } from './admin-route-definitions';
import { createNavigation } from './navigation-config';
import { defaultAccess } from '../../test/default-access';

const as = (...roles: string[]) => ({ roles, access: defaultAccess(roles) });

describe('legacy Admin navigation', () => {
  it('links «КП» and «Налаштування КП»; later КП pages have no link', () => {
    const paths = new Set(adminRouteDefinitions.map((route) => route.path));
    const manager = createNavigation(paths, as('Admin')).find(
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
    const reminders = createNavigation(paths, as('Admin')).find(
      (group) => group.id === 'reminders',
    );
    expect(reminders?.items.map((item) => item.to)).toEqual([
      '/reminders/tasks',
      '/reminders/periods',
      '/reminders/chats',
      '/reminders/non-working-days',
    ]);
  });
  it('keeps every Admin entry in its section, with reminders and site content', () => {
    const groups = createNavigation(new Set(['/']), as('Admin'));

    expect(groups.map((group) => group.label)).toEqual([
      'Менеджер сервісу',
      'Швейний цех',
      'Склад тканин',
      'Нагадування',
      'Загальні довідники',
      'Фото',
      'Контент',
      'Загальні звіти',
      'Адміністрування',
    ]);
    expect(groups.map((group) => group.items.length)).toEqual([6, 8, 7, 4, 8, 1, 11, 1, 5]);
    expect(new Set(groups.flatMap((group) => group.items.map((item) => item.id))).size).toBe(51);
    expect(groups[0].items.map((item) => item.id)).not.toContain('clients');
  });
  it('shows «Налаштування КП» only for the server Admin role', () => {
    const paths = new Set(['/crm/quotes']);
    const admin = createNavigation(paths, as('Admin'));
    const manager = createNavigation(paths, as('Manager'));
    expect(admin[0].items.some((item) => item.id === 'quote-settings')).toBe(true);
    expect(manager[0].items.some((item) => item.id === 'quote-settings')).toBe(false);
    expect(manager[0].items.find((item) => item.id === 'quotes')?.to).toBe('/crm/quotes');
  });

  it('shows the photo library as its own group with its registered route', () => {
    const groups = createNavigation(new Set(['/', '/media']), as('Manager'));
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

  it('shows «Товари сайту», «Розділи сайту» and «Статті» to roles that may see them', () => {
    const paths = new Set(adminRouteDefinitions.map((route) => route.path));
    const item = (role: string, id: string) =>
      createNavigation(paths, as(role))
        .find((group) => group.id === 'content')
        ?.items.find((entry) => entry.id === id);

    expect(item('Admin', 'site-products')?.to).toBe('/content/products');
    expect(item('Manager', 'site-products')?.to).toBe('/content/products');
    expect(item('Accountant', 'site-products')).toBeUndefined();
    expect(item('Admin', 'site-categories')?.to).toBe('/content/categories');
    expect(item('Manager', 'site-categories')?.to).toBe('/content/categories');
    expect(item('Accountant', 'site-categories')).toBeUndefined();
    expect(item('Admin', 'site-articles')?.to).toBe('/content/articles');
    expect(item('Manager', 'site-articles')?.to).toBe('/content/articles');
    expect(item('Accountant', 'site-articles')).toBeUndefined();
    expect(item('Admin', 'site-redirects')?.to).toBe('/content/redirects');
    expect(item('Manager', 'site-redirects')?.to).toBe('/content/redirects');
    expect(item('Accountant', 'site-redirects')).toBeUndefined();
    expect(item('Admin', 'site-seo-settings')?.to).toBe('/content/seo-settings');
    expect(item('Manager', 'site-seo-settings')?.to).toBe('/content/seo-settings');
    expect(item('Accountant', 'site-seo-settings')).toBeUndefined();
    expect(item('Admin', 'site-pages')?.to).toBe('/content/site-pages');
    expect(item('Manager', 'site-pages')?.to).toBe('/content/site-pages');
    expect(item('Accountant', 'site-pages')).toBeUndefined();
    expect(item('Admin', 'site-seo-overview')?.to).toBe('/content/seo-overview');
    expect(item('Manager', 'site-seo-overview')?.to).toBe('/content/seo-overview');
    expect(item('Accountant', 'site-seo-overview')).toBeUndefined();
    expect(item('Admin', 'site-company')?.to).toBe('/content/company');
    expect(item('Manager', 'site-company')?.to).toBe('/content/company');
    expect(item('Accountant', 'site-company')).toBeUndefined();
    expect(item('Admin', 'site-works')?.to).toBe('/content/works');
    expect(item('Manager', 'site-certificates')?.to).toBe('/content/certificates');
    expect(item('Accountant', 'site-works')).toBeUndefined();
  });

  it('enables a legacy URL only when the React route is registered', () => {
    const legacyPath = '/references/counterparties';
    const unavailable = createNavigation(new Set(['/']), as('Manager'));
    const available = createNavigation(new Set(['/', legacyPath]), as('Manager'));

    const references = (groups: typeof available) =>
      groups.find((group) => group.id === 'references')?.items[4];
    expect(references(unavailable)?.to).toBeUndefined();
    expect(references(available)?.to).toBe(legacyPath);
    expect(available[0].items[2].to).toBeUndefined();
  });

  it('shows «Користувачі», «Завдання менеджерам», «Налаштування ШІ» and «Права доступу» only to Admin', () => {
    const paths = new Set([
      '/admin/users',
      '/admin/tasks',
      '/admin/leads',
      '/admin/ai',
      '/admin/access',
    ]);
    const admin = createNavigation(paths, as('Admin')).find(
      (group) => group.id === 'administration',
    );

    expect(admin?.items).toEqual([
      { id: 'users', label: 'Користувачі', to: '/admin/users' },
      { id: 'manager-tasks', label: 'Завдання менеджерам', to: '/admin/tasks' },
      { id: 'lead-stats', label: 'Статистика лідів', to: '/admin/leads' },
      { id: 'ai-settings', label: 'Налаштування ШІ', to: '/admin/ai' },
      { id: 'access-rights', label: 'Права доступу', to: '/admin/access' },
    ]);
    expect(
      createNavigation(paths, as('Manager')).some((group) => group.id === 'administration'),
    ).toBe(false);
  });

  it('shows «Ліди» to Manager and Admin and «Статистика лідів» to Admin by default', () => {
    const paths = new Set(['/crm/leads', '/admin/leads']);
    const item = (roles: string[], group: string, id: string) =>
      createNavigation(paths, as(...roles))
        .find((x) => x.id === group)
        ?.items.find((x) => x.id === id);

    expect(item(['Manager'], 'service-manager', 'leads')?.to).toBe('/crm/leads');
    expect(item(['Admin'], 'administration', 'lead-stats')?.to).toBe('/admin/leads');
    expect(item(['Manager'], 'administration', 'lead-stats')).toBeUndefined();
    expect(item(['Accountant'], 'service-manager', 'leads')).toBeUndefined();
  });

  it('shows the «Швейний цех» pages to the head of the workshop and Admin only', () => {
    const paths = new Set([
      '/production/orders',
      '/production/work',
      '/production/forecast',
      '/production/people',
      '/production/fabric-norms',
      '/production/reports',
      '/production/archive',
    ]);
    const shop = (roles: string[]) =>
      createNavigation(paths, as(...roles)).find((group) => group.id === 'sewing-shop');

    expect(
      shop(['WorkshopChief'])
        ?.items.slice(0, 5)
        .map((item) => item.to),
    ).toEqual([
      '/production/orders',
      '/production/work',
      '/production/forecast',
      '/production/people',
      '/production/fabric-norms',
    ]);
    expect(shop(['Admin'])?.items[3].label).toBe('Персонал цеху');
    expect(shop(['Manager'])?.items.some((item) => item.id === 'workshop-people')).toBe(false);
    expect(shop(['Manager'])?.items.some((item) => item.id === 'work-log')).toBe(false);
    expect(shop(['Manager'])?.items.some((item) => item.id === 'salary')).toBe(false);
    expect(shop(['Admin'])?.items.find((item) => item.id === 'workshop-reports')?.to).toBe(
      '/production/reports',
    );
    expect(shop(['WorkshopChief'])?.items.some((item) => item.id === 'workshop-reports')).toBe(
      false,
    );
    expect(shop(['Manager'])?.items.find((item) => item.id === 'workshop-archive')?.to).toBe(
      '/production/archive',
    );
    expect(shop(['Manager'])?.items[1]).toEqual({
      id: 'sewing-forecast',
      label: 'Прогноз пошиття',
      to: '/production/forecast',
    });
  });

  it('shows «Виробничі завдання» to managers as well', () => {
    const paths = new Set(['/production/orders']);
    const shop = createNavigation(paths, as('Manager')).find((group) => group.id === 'sewing-shop');

    expect(shop?.items[0]).toEqual({
      id: 'production-orders',
      label: 'Виробничі завдання',
      to: '/production/orders',
    });
  });

  it('shows «Склад тканин» as its own block right under «Швейний цех»', () => {
    const paths = new Set(['/production/orders', '/warehouse/stock']);
    const groups = (roles: string[]) => createNavigation(paths, as(...roles));
    const warehouse = (roles: string[]) =>
      groups(roles).find((group) => group.id === 'fabric-warehouse');
    const ids = groups(['Admin']).map((group) => group.id);

    expect(ids.indexOf('fabric-warehouse')).toBe(ids.indexOf('sewing-shop') + 1);
    expect(warehouse(['Manager'])?.label).toBe('Склад тканин');
    expect(warehouse(['Manager'])?.items.find((item) => item.id === 'fabric-stock')).toEqual({
      id: 'fabric-stock',
      label: 'Залишки',
      to: '/warehouse/stock',
    });
    expect(warehouse(['Admin'])?.items.map((item) => item.label)).toEqual([
      'Рух тканини',
      'Залишки',
      'Початкові залишки',
      'План і факт',
      'Бронь і що замовити',
      'Вартість складу',
      'Фурнітура до замовлення',
    ]);
    expect(warehouse(['WorkshopChief'])?.items.some((item) => item.id === 'fabric-valuation')).toBe(
      false,
    );
    expect(warehouse(['Accountant'])).toBeUndefined();
  });

  it('shows «Бухгалтерія» to the director only and links its pages', () => {
    const paths = new Set([
      '/accounting/overview',
      '/accounting/transactions',
      '/accounting/transfers',
      '/accounting/accounts',
      '/accounting/categories',
      '/accounting/counterparties',
      '/accounting/purchase-invoices',
      '/accounting/review',
      '/accounting/statements',
      '/accounting/legacy-import',
      '/accounting/reports',
      '/accounting/audit',
    ]);
    const accounting = (roles: string[]) =>
      createNavigation(paths, as(...roles)).find((group) => group.id === 'accounting');

    expect(accounting(['Director'])?.items.filter((item) => item.to)).toEqual([
      { id: 'finance-overview', label: 'Огляд', to: '/accounting/overview' },
      { id: 'finance-operations', label: 'Операції', to: '/accounting/transactions' },
      { id: 'finance-transfers', label: 'Перекази', to: '/accounting/transfers' },
      { id: 'finance-accounts', label: 'Рахунки і каси', to: '/accounting/accounts' },
      { id: 'finance-categories', label: 'Категорії', to: '/accounting/categories' },
      { id: 'finance-counterparties', label: 'Контрагенти', to: '/accounting/counterparties' },
      {
        id: 'purchase-invoices',
        label: 'Рахунки на закупку',
        to: '/accounting/purchase-invoices',
      },
      { id: 'finance-review', label: 'Потребують перевірки', to: '/accounting/review' },
      { id: 'finance-import', label: 'Виписки банку', to: '/accounting/statements' },
      {
        id: 'finance-legacy-import',
        label: 'Перенесення архіву',
        to: '/accounting/legacy-import',
      },
      { id: 'finance-reports', label: 'Звіти', to: '/accounting/reports' },
      { id: 'finance-audit', label: 'Журнал змін', to: '/accounting/audit' },
    ]);
    expect(accounting(['Director'])?.items).toHaveLength(12);
    expect(accounting(['Admin'])).toBeUndefined();
    expect(accounting(['Accountant'])).toBeUndefined();
  });
});
