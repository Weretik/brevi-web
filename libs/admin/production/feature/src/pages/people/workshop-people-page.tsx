import { useGetPayrollMonthQuery, useGetPayrollYearQuery } from '@admin/production/data-access';
import { formatWorkMonth, payrollMonthOf, shiftWorkMonth, todayIso } from '@admin/production/model';
import { PayrollYearTable, PeriodStepper } from '@admin/production/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Box, Tab, Tabs } from '@mui/material';
import { lazy, Suspense, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { PayrollMonthView } from '../../components/payroll/payroll-month-view';
import { TimesheetDrawer } from '../../components/people/timesheet-drawer';

import type { WorkshopPeopleAccess } from '@admin/production/model';

const TimesheetPage = lazy(() => import('../timesheet/timesheet-page'));
const WorkshopStaffPage = lazy(() => import('../staff/workshop-staff-page'));

type PeopleTab = 'month' | 'payments' | 'year' | 'timesheet' | 'staff';

interface Props {
  /** Which parts the signed-in person's «Права доступу» let them open. */
  useAccess: () => WorkshopPeopleAccess;
}

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

/**
 * «Швейний цех › Персонал цеху»: the month pulse (hours, pay, payments, year) on one period, with «Відмітити день»
 * in a side panel and the list of workers; each part keeps its own right.
 */
export function WorkshopPeoplePage({ useAccess }: Props) {
  const access = useAccess();
  const [params, setParams] = useSearchParams();
  const tabs = tabsFor(access);
  const requested = params.get('tab');
  // Old addresses: «Робочий час» is now a panel over the month, «Зарплата» is the month.
  const alias = access.payroll && (requested === 'timesheet' || requested === 'payroll');
  const current = tabs.find((tab) => tab.value === (alias ? 'month' : requested)) ?? tabs[0];
  const [markDay, setMarkDay] = useState(
    access.payroll && access.timesheet && requested === 'timesheet',
  );
  const today = payrollMonthOf(todayIso());
  const [month, setMonth] = useState(today);
  const [message, setMessage] = useState<string | null>(null);
  const inMonth = current?.value === 'month' || current?.value === 'payments';
  const monthQuery = useGetPayrollMonthQuery(month, { skip: !inMonth });
  const yearQuery = useGetPayrollYearQuery(Number(month.slice(0, 4)), {
    skip: current?.value !== 'year',
  });
  const active = inMonth ? monthQuery : current?.value === 'year' ? yearQuery : null;
  const year = Number(month.slice(0, 4));
  const stepper =
    current?.value === 'year' ? (
      <PeriodStepper
        label={String(year)}
        canNext={year < Number(today.slice(0, 4))}
        onMove={(by) => setMonth(shiftWorkMonth(month, by * 12))}
      />
    ) : (
      <PeriodStepper
        label={formatWorkMonth(month)}
        canNext={month < today}
        onMove={(by) => setMonth(shiftWorkMonth(month, by))}
      />
    );

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Швейний цех"
        title="Персонал цеху"
        subtitle="Місяць цеху: години, нарахування, виплати й список працівників."
        actions={null}
      />
      {current && (
        <>
          <Tabs
            value={current.value}
            onChange={(_event, next: PeopleTab) => setParams({ tab: next }, { replace: true })}
            sx={{ mb: 2 }}
          >
            {tabs.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>
          {active && (
            <ReferenceListAlerts
              error={
                active.error
                  ? adminApiErrorMessage(active.error, 'Не вдалося завантажити зарплату.')
                  : null
              }
              loading={active.isFetching}
              onRetry={() => void active.refetch()}
              actionMessage={message}
              onCloseActionMessage={() => setMessage(null)}
            />
          )}
          {inMonth &&
            (monthQuery.data ? (
              <PayrollMonthView
                month={monthQuery.data}
                section={current.value === 'payments' ? 'payments' : 'people'}
                stepper={stepper}
                onMarkDay={access.timesheet ? () => setMarkDay(true) : undefined}
                onMessage={setMessage}
              />
            ) : (
              stepper
            ))}
          {current.value === 'year' && (
            <>
              <Box sx={{ mb: 2 }}>{stepper}</Box>
              {yearQuery.data && <PayrollYearTable year={yearQuery.data} currentMonth={today} />}
            </>
          )}
          <Suspense fallback={null}>
            {current.value === 'timesheet' && <TimesheetPage />}
            {current.value === 'staff' && <WorkshopStaffPage />}
          </Suspense>
          {access.timesheet && access.payroll && (
            <TimesheetDrawer open={markDay} onClose={() => setMarkDay(false)} />
          )}
        </>
      )}
    </Box>
  );
}

export default WorkshopPeoplePage;
