import { useSearchParams } from 'react-router-dom';

import type { CustomerCardAccess } from '../../clients.routes';

export type CustomerTab = 'overview' | 'quotes' | 'orders' | 'tasks' | 'embroidery' | 'finance';

const pages: Readonly<Record<Exclude<CustomerTab, 'overview'>, keyof CustomerCardAccess>> = {
  quotes: 'quotes',
  orders: 'productionOrders',
  tasks: 'tasks',
  embroidery: 'embroidery',
  finance: 'finance',
};

/** The tabs of a client card the user may open: «Огляд» always, the rest by «Права доступу». */
export function customerTabs(access: CustomerCardAccess): CustomerTab[] {
  return [
    'overview',
    ...(Object.keys(pages) as Exclude<CustomerTab, 'overview'>[]).filter(
      (tab) => access[pages[tab]],
    ),
  ];
}

/** `?tab=` of the client card (CARD-001); an unknown or forbidden tab is «Огляд». */
export function useCustomerTab(access: CustomerCardAccess) {
  const [params, setParams] = useSearchParams();
  const allowed = customerTabs(access);
  const raw = params.get('tab');
  const tab = allowed.find((value) => value === raw) ?? 'overview';
  const setTab = (next: CustomerTab) => {
    const query = new URLSearchParams(params);
    if (next === 'overview') query.delete('tab');
    else query.set('tab', next);
    setParams(query, { replace: true });
  };
  return { tab, tabs: allowed, setTab };
}
