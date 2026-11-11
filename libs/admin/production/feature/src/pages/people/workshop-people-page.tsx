import { ReferencePageHeader } from '@admin/references/ui';
import { Box, Tab, Tabs } from '@mui/material';
import { lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { WorkshopPeopleAccess } from '@admin/production/model';

const TimesheetPage = lazy(() => import('../timesheet/timesheet-page'));
const PayrollPage = lazy(() => import('../payroll/payroll-page'));
const WorkshopStaffPage = lazy(() => import('../staff/workshop-staff-page'));

type PeopleTab = 'timesheet' | 'payroll' | 'staff';

const tabs: readonly { value: PeopleTab; label: string }[] = [
  { value: 'timesheet', label: 'Робочий час' },
  { value: 'payroll', label: 'Зарплата' },
  { value: 'staff', label: 'Працівники' },
];

interface Props {
  /** Which tabs the signed-in person's «Права доступу» let them open. */
  useAccess: () => WorkshopPeopleAccess;
}

/** «Швейний цех › Персонал цеху»: hours, pay and the list of workers on one page; each tab keeps its own right. */
export function WorkshopPeoplePage({ useAccess }: Props) {
  const access = useAccess();
  const [params, setParams] = useSearchParams();
  const visible = tabs.filter((tab) => access[tab.value]);
  const requested = params.get('tab');
  const current = visible.find((tab) => tab.value === requested) ?? visible[0];

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Швейний цех"
        title="Персонал цеху"
        subtitle="Години, зарплата і список працівників в одному місці."
        actions={null}
      />
      {current && (
        <>
          <Tabs
            value={current.value}
            onChange={(_event, next: PeopleTab) => setParams({ tab: next }, { replace: true })}
            sx={{ mb: 2 }}
          >
            {visible.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>
          <Suspense fallback={null}>
            {current.value === 'timesheet' && <TimesheetPage />}
            {current.value === 'payroll' && <PayrollPage />}
            {current.value === 'staff' && <WorkshopStaffPage />}
          </Suspense>
        </>
      )}
    </Box>
  );
}

export default WorkshopPeoplePage;
