import { useGetPayrollMonthQuery, useGetPayrollYearQuery } from '@admin/production/data-access';
import { formatWorkMonth, shiftWorkMonth } from '@admin/production/model';
import { useState } from 'react';

import type { PeopleTab } from '../people/use-workshop-people-tabs';

/**
 * The period of the pay tabs: a month for «Місяць» and «Виплати», a year for «Рік», never past `today` (yyyy-mm).
 * Only the open tab's data is loaded.
 */
export function usePayrollPeriod(tab: PeopleTab | undefined, today: string) {
  const [month, setMonth] = useState(today);
  const inMonth = tab === 'month' || tab === 'payments';
  const inYear = tab === 'year';
  const year = Number(month.slice(0, 4));
  const monthQuery = useGetPayrollMonthQuery(month, { skip: !inMonth });
  const yearQuery = useGetPayrollYearQuery(year, { skip: !inYear });

  return {
    month,
    inMonth,
    monthQuery,
    yearQuery,
    active: inMonth ? monthQuery : inYear ? yearQuery : null,
    label: inYear ? String(year) : formatWorkMonth(month),
    canNext: inYear ? year < Number(today.slice(0, 4)) : month < today,
    move: (by: number) => setMonth((value) => shiftWorkMonth(value, inYear ? by * 12 : by)),
  };
}
