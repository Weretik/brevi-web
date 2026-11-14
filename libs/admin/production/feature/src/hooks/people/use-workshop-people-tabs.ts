import { useSearchParams } from 'react-router-dom';

import type { WorkshopPeopleAccess } from '@admin/production/model';

export type PeopleTab = 'month' | 'payments' | 'year' | 'timesheet' | 'staff';

/** The tabs this person gets: the pay pulse needs «Зарплата»; hours alone keep their own tab. */
function tabsFor(access: WorkshopPeopleAccess): { value: PeopleTab; label: string }[] {
  return [
    ...(access.payroll
      ? [
          { value: 'month' as const, label: 'Місяць' },
          { value: 'payments' as const, label: 'Виплати і коригування' },
          { value: 'year' as const, label: 'Рік' },
        ]
      : []),
    ...(access.timesheet && !access.payroll
      ? [{ value: 'timesheet' as const, label: 'Робочий час' }]
      : []),
    ...(access.staff ? [{ value: 'staff' as const, label: 'Працівники' }] : []),
  ];
}

/** Tabs of «Персонал цеху» in `?tab=`; old «Робочий час» and «Зарплата» addresses open the month. */
export function useWorkshopPeopleTabs(access: WorkshopPeopleAccess) {
  const [params, setParams] = useSearchParams();
  const tabs = tabsFor(access);
  const requested = params.get('tab');
  const alias = access.payroll && (requested === 'timesheet' || requested === 'payroll');
  const current = tabs.find((tab) => tab.value === (alias ? 'month' : requested)) ?? tabs[0];

  return {
    tabs,
    current,
    select: (tab: PeopleTab) => setParams({ tab }, { replace: true }),
    /** «Робочий час» is now a panel over the month: its old address opens that panel. */
    markDayOnOpen: access.payroll && access.timesheet && requested === 'timesheet',
  };
}
