import { useSearchParams } from 'react-router-dom';

export type CustomerTab = 'card' | 'quotes' | 'orders';

const tabOf = (value: string | null): CustomerTab =>
  value === 'quotes' || value === 'orders' ? value : 'card';

/** `?tab=` of the client card: «Картка», «КП», «Завдання в цех». */
export function useCustomerTab() {
  const [params, setParams] = useSearchParams();
  const tab = tabOf(params.get('tab'));
  const setTab = (next: CustomerTab) =>
    setParams(next === 'card' ? {} : { tab: next }, { replace: true });
  return { tab, setTab };
}
