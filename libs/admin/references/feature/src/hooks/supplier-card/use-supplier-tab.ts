import { useSearchParams } from 'react-router-dom';

import type { SupplierCardAccess } from '../../references.routes';

export type SupplierTab =
  'overview' | 'fabrics' | 'accessories' | 'products' | 'receipts' | 'invoices' | 'finance';

const pages: Readonly<Record<Exclude<SupplierTab, 'overview'>, keyof SupplierCardAccess>> = {
  fabrics: 'materials',
  accessories: 'materials',
  products: 'products',
  receipts: 'fabricStock',
  invoices: 'purchaseInvoices',
  finance: 'finance',
};

/** The tabs of a supplier card the user may open: «Огляд» always, the rest by «Права доступу». */
export function supplierTabs(access: SupplierCardAccess): SupplierTab[] {
  return [
    'overview',
    ...(Object.keys(pages) as Exclude<SupplierTab, 'overview'>[]).filter(
      (tab) => access[pages[tab]],
    ),
  ];
}

/** `?tab=` of the supplier card (CARD-001); an unknown or forbidden tab is «Огляд». */
export function useSupplierTab(access: SupplierCardAccess) {
  const [params, setParams] = useSearchParams();
  const tabs = supplierTabs(access);
  const tab = tabs.find((value) => value === params.get('tab')) ?? 'overview';
  const setTab = (next: SupplierTab) => {
    const query = new URLSearchParams(params);
    if (next === 'overview') query.delete('tab');
    else query.set('tab', next);
    setParams(query, { replace: true });
  };
  return { tab, tabs, setTab };
}
