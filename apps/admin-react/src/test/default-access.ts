import type { AccessAction, SessionAccess } from '@admin/core/auth';

const V: readonly AccessAction[] = ['view'];
const VE: readonly AccessAction[] = ['view', 'edit'];
const VCE: readonly AccessAction[] = ['view', 'create', 'edit'];
const All: readonly AccessAction[] = ['view', 'create', 'edit', 'delete'];

/** The server's rights of the built-in roles before anyone saves «Права доступу» (AccessCatalog defaults). */
const defaults: Readonly<Record<string, Readonly<Record<string, readonly AccessAction[]>>>> = {
  Admin: {
    leads: VE,
    'lead-stats': VCE,
    quotes: VCE,
    'quote-settings': VE,
    embroidery: VE,
    tasks: VE,
    'production-orders': All,
    'fabric-stock': VE,
    'work-log': VE,
    forecast: VE,
    'workshop-staff': VE,
    'fabric-norms': VE,
    'workshop-settings': VE,
    'workshop-archive': VE,
    payroll: VE,
    timesheet: VE,
    'workshop-reports': V,
    reminders: VE,
    products: All,
    'product-sections': All,
    materials: All,
    operations: All,
    counterparties: All,
    'pricing-parameters': All,
    'price-import': All,
    media: All,
    'content-products': All,
    'content-categories': All,
    'content-articles': All,
  },
  Manager: {
    leads: VE,
    quotes: VCE,
    embroidery: VE,
    tasks: VE,
    'production-orders': All,
    'fabric-stock': VE,
    forecast: VE,
    'workshop-archive': VE,
    products: All,
    'product-sections': All,
    materials: All,
    operations: All,
    counterparties: All,
    'pricing-parameters': All,
    'price-import': All,
    media: All,
    'content-products': V,
    'content-categories': V,
    'content-articles': V,
  },
  Accountant: {
    products: V,
    'product-sections': V,
    materials: V,
    operations: V,
    'pricing-parameters': V,
    'price-import': V,
  },
  WorkshopChief: {
    'production-orders': All,
    'fabric-stock': VE,
    'work-log': VE,
    forecast: VE,
    'workshop-staff': VE,
    'fabric-norms': VE,
    'workshop-settings': VE,
    'workshop-archive': VE,
    payroll: VE,
    timesheet: VE,
  },
};

const titles: Readonly<Record<string, string>> = {
  Director: 'Директор',
  Admin: 'Адміністратор',
  Manager: 'Менеджер',
  Accountant: 'Бухгалтер',
  WorkshopChief: 'Начальник цеху',
};

/** Rights of these roles together, as GET /api/auth/session/access returns them. */
export function defaultAccess(roles: readonly string[]): SessionAccess {
  const grants: Record<string, AccessAction[]> = {};
  for (const role of roles) {
    for (const [page, actions] of Object.entries(defaults[role] ?? {})) {
      grants[page] = [...new Set([...(grants[page] ?? []), ...actions])];
    }
  }
  return {
    allowAll: roles.includes('Director'),
    roles: roles.map((name) => ({ name, title: titles[name] ?? name, builtIn: name in titles })),
    grants,
  };
}
