import { legacyGroups } from './legacy-menu';

/** Pages reached from inside another page, not from the menu. */
const innerPages: readonly (readonly [string, string])[] = [
  ['/crm/clients', 'counterparties'],
  ['/crm/quote-introductions', 'quotes'],
  ['/references/fabric', 'materials'],
  ['/references/garment-accessory', 'materials'],
  ['/references/supplier', 'counterparties'],
  ['/references/media', 'media'],
  ['/accounting', 'accounting'],
];

const pagePaths: readonly (readonly [string, string])[] = [
  ...legacyGroups.flatMap((group) =>
    group.items.flatMap((item) =>
      item.path && item.access ? [[item.path, item.access] as const] : [],
    ),
  ),
  ...innerPages,
].sort(([a], [b]) => b.length - a.length);

/** The «Права доступу» page a URL belongs to: the longest menu path it starts with, or null. */
export function accessPageOf(pathname: string): string | null {
  const match = pagePaths.find(([path]) => pathname === path || pathname.startsWith(`${path}/`));
  return match ? match[1] : null;
}
