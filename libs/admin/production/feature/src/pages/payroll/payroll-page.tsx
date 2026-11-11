import { useGetPayrollMonthQuery, useGetPayrollYearQuery } from '@admin/production/data-access';
import { formatWorkMonth, payrollMonthOf, shiftWorkMonth, todayIso } from '@admin/production/model';
import { PayrollYearTable, WorkshopTabHeader } from '@admin/production/ui';
import { ReferenceListAlerts } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { Box, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';

import { PayrollMonthView } from '../../components/payroll/payroll-month-view';

type View = 'month' | 'year';

function Stepper({
  label,
  canNext,
  onMove,
}: {
  label: string;
  canNext: boolean;
  onMove: (by: number) => void;
}) {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5, mb: 2 }}>
      <IconButton aria-label="Попередній" onClick={() => onMove(-1)}>
        <ChevronLeftOutlinedIcon />
      </IconButton>
      <Typography sx={{ minWidth: 140, textAlign: 'center', fontWeight: 600 }}>{label}</Typography>
      <IconButton aria-label="Наступний" disabled={!canNext} onClick={() => onMove(1)}>
        <ChevronRightOutlinedIcon />
      </IconButton>
    </Stack>
  );
}

/** «Швейний цех › Персонал цеху › Зарплата»: the pay of a month and the year in totals. */
export function PayrollPage() {
  const current = payrollMonthOf(todayIso());
  const [view, setView] = useState<View>('month');
  const [month, setMonth] = useState(current);
  const [year, setYear] = useState(Number(current.slice(0, 4)));
  const [message, setMessage] = useState<string | null>(null);
  const monthQuery = useGetPayrollMonthQuery(month, { skip: view !== 'month' });
  const yearQuery = useGetPayrollYearQuery(year, { skip: view !== 'year' });
  const active = view === 'month' ? monthQuery : yearQuery;

  return (
    <Box sx={{ minWidth: 0 }}>
      <WorkshopTabHeader subtitle="З журналу робіт і «Параметрів ціноутворення»: пошив, крій, премія, частки, вишивка, виплати." />
      <Tabs value={view} onChange={(_event, next: View) => setView(next)} sx={{ mb: 2 }}>
        <Tab value="month" label="Розрахунок" />
        <Tab value="year" label="Історія за рік" />
      </Tabs>
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
      {view === 'month' ? (
        <>
          <Stepper
            label={formatWorkMonth(month)}
            canNext={month < current}
            onMove={(by) => setMonth(shiftWorkMonth(month, by))}
          />
          {monthQuery.data && <PayrollMonthView month={monthQuery.data} onMessage={setMessage} />}
        </>
      ) : (
        <>
          <Stepper
            label={String(year)}
            canNext={year < Number(current.slice(0, 4))}
            onMove={(by) => setYear(year + by)}
          />
          {yearQuery.data && <PayrollYearTable year={yearQuery.data} currentMonth={current} />}
        </>
      )}
    </Box>
  );
}

export default PayrollPage;
