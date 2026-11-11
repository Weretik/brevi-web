import type { AccessAction, SessionAccess } from '@admin/core/auth';

const V: readonly AccessAction[] = ['view'];
const VE: readonly AccessAction[] = ['view', 'edit'];
const VCE: readonly AccessAction[] = ['view', 'create', 'edit'];
const All: readonly AccessAction[] = ['view', 'create', 'edit', 'delete'];
const VC: readonly AccessAction[] = ['view', 'create'];

/** The server's rights of the built-in roles before anyone saves «Права доступу» (AccessCatalog defaults). */
const defaults: Readonly<Record<string, Readonly<Record<string, readonly AccessAction[]>>>> = {
  Admin: {
    'desk-main': V,
    'desk-sales': V,
    'desk-workshop': V,
    'desk-seo': V,
    leads: VE,
    'lead-stats': VCE,
    quotes: VCE,
    'quote-settings': VE,
    embroidery: VE,
    tasks: VE,
    'production-orders': All,
    'fabric-stock': VE,
    'fabric-plan-fact': V,
    'fabric-booking': V,
    'fabric-valuation': V,
    'hardware-order': V,
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
    'content-redirects': All,
    'content-seo-settings': VE,
    'content-site-pages': VE,
    'content-seo-overview': V,
  },
  Manager: {
    'desk-sales': V,
    leads: VE,
    quotes: VCE,
    embroidery: VE,
    tasks: VE,
    'production-orders': All,
    'fabric-stock': VE,
    'fabric-plan-fact': V,
    'fabric-booking': V,
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
    'content-redirects': V,
    'content-seo-settings': V,
    'content-site-pages': V,
    'content-seo-overview': V,
  },
  Accountant: {
    'desk-accounting': V,
    products: V,
    'product-sections': V,
    materials: V,
    operations: V,
    'pricing-parameters': V,
    'price-import': V,
  },
  WorkshopChief: {
    'desk-workshop': V,
    'production-orders': All,
    'fabric-stock': VE,
    'fabric-plan-fact': V,
    'fabric-booking': V,
    'hardware-order': V,
    'work-log': VE,
    forecast: VE,
    'workshop-staff': VE,
    'fabric-norms': VE,
    'workshop-settings': VE,
    'workshop-archive': VE,
    payroll: VE,
    timesheet: VE,
  },
  Seo: {
    'desk-seo': V,
    media: VC,
    'content-products': VCE,
    'content-categories': VCE,
    'content-articles': VCE,
    'content-redirects': VCE,
    'content-seo-settings': VE,
    'content-site-pages': VE,
    'content-seo-overview': V,
  },
};

const titles: Readonly<Record<string, string>> = {
  Director: 'Директор',
  Admin: 'Адміністратор',
  Manager: 'Менеджер',
  Accountant: 'Бухгалтер',
  WorkshopChief: 'Начальник цеху',
  Seo: 'SEO-фахівець',
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
