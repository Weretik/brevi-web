import { useSearchParams } from 'react-router-dom';

export type CustomerTab = 'card' | 'quotes' | 'orders' | 'finance';

const tabOf = (value: string | null, canSeeFinance: boolean): CustomerTab =>
  value === 'quotes' || value === 'orders' || (value === 'finance' && canSeeFinance)
    ? value
    : 'card';

/** `?tab=` of the client card: «Картка», «КП», «Завдання в цех», «Фінанси» (only with «Бухгалтерія»). */
export function useCustomerTab(canSeeFinance = false) {
  const [params, setParams] = useSearchParams();
  const tab = tabOf(params.get('tab'), canSeeFinance);
  const setTab = (next: CustomerTab) =>
    setParams(next === 'card' ? {} : { tab: next }, { replace: true });
  return { tab, setTab };
}
