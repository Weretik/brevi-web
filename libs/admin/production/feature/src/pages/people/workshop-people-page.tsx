import { payrollMonthOf, todayIso } from '@admin/production/model';
import { PayrollYearTable, PeriodStepper } from '@admin/production/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { PageRightsScope } from '@admin/shared/ui';
import { Box, Tab, Tabs } from '@mui/material';
import { lazy, Suspense, useState } from 'react';

import { PayrollMonthView } from '../../components/payroll/payroll-month-view';
import { TimesheetDrawer } from '../../components/people/timesheet-drawer';
import { usePayrollPeriod } from '../../hooks/payroll/use-payroll-period';
import { useWorkshopPeopleTabs } from '../../hooks/people/use-workshop-people-tabs';

import type { PeopleTab } from '../../hooks/people/use-workshop-people-tabs';
import type { WorkshopPeopleAccess } from '@admin/production/model';

const TimesheetPage = lazy(() => import('../timesheet/timesheet-page'));
const WorkshopStaffPage = lazy(() => import('../staff/workshop-staff-page'));

interface Props {
  /** Which parts the signed-in person's «Права доступу» let them open. */
  useAccess: () => WorkshopPeopleAccess;
}

/**
 * «Швейний цех › Персонал цеху»: the month pulse (hours, pay, payments, year) on one period, with «Відмітити день»
 * in a side panel and the list of workers; each part keeps its own right.
 */
export function WorkshopPeoplePage({ useAccess }: Props) {
  const access = useAccess();
  const { tabs, current, select, markDayOnOpen } = useWorkshopPeopleTabs(access);
  const [markDay, setMarkDay] = useState(markDayOnOpen);
  const today = payrollMonthOf(todayIso());
  const period = usePayrollPeriod(current?.value, today);
  const { monthQuery, yearQuery, active, inMonth } = period;
  const [message, setMessage] = useState<string | null>(null);
  const stepper = (
    <PeriodStepper label={period.label} canNext={period.canNext} onMove={period.move} />
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
            onChange={(_event, next: PeopleTab) => select(next)}
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
              <PageRightsScope page="payroll">
                <PayrollMonthView
                  month={monthQuery.data}
                  section={current.value === 'payments' ? 'payments' : 'people'}
                  stepper={stepper}
                  onMarkDay={access.timesheet ? () => setMarkDay(true) : undefined}
                  onMessage={setMessage}
                />
              </PageRightsScope>
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
            {current.value === 'timesheet' && (
              <PageRightsScope page="timesheet">
                <TimesheetPage />
              </PageRightsScope>
            )}
            {current.value === 'staff' && (
              <PageRightsScope page="workshop-staff">
                <WorkshopStaffPage />
              </PageRightsScope>
            )}
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
