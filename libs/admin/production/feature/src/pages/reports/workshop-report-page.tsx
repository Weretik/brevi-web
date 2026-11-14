import { useGetWorkshopReportQuery } from '@admin/production/data-access';
import { payrollMonthOf, reportPeriodLabel, todayIso } from '@admin/production/model';
import {
  ReportMaterialsTable,
  ReportOutputTable,
  ReportPeriodBar,
  ReportStaffTable,
  ReportStockTable,
  ReportTotals,
} from '@admin/production/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Alert, Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';

import { useReportPeriod } from '../../hooks/reports/use-report-period';

type View = 'overview' | 'output' | 'staff' | 'materials' | 'stock';

const views: { value: View; label: string }[] = [
  { value: 'overview', label: 'Огляд' },
  { value: 'output', label: 'Випуск' },
  { value: 'staff', label: 'Працівники' },
  { value: 'materials', label: 'Видані матеріали' },
  { value: 'stock', label: 'Залишки' },
];

/** «Швейний цех › Звіти цеху» (Admin): output, pay, fabric and stock of whole months, with a comparison. */
export function WorkshopReportPage() {
  const current = payrollMonthOf(todayIso());
  const period = useReportPeriod(current);
  const [view, setView] = useState<View>('overview');
  const { problem } = period;
  const query = useGetWorkshopReportQuery(period.query, { skip: problem !== null });
  const report = query.data?.current;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Швейний цех"
        title="Звіти цеху"
        subtitle="Випуск за цінами КП, нарахування, видана тканина й залишки за цілі місяці."
        actions={null}
      />
      <ReportPeriodBar
        current={current}
        from={period.from}
        to={period.to}
        onFromChange={period.setFrom}
        onToChange={period.setTo}
        compare={period.compare}
        onCompareChange={period.setCompare}
        compareFrom={period.compareFrom}
        compareTo={period.compareTo}
        onCompareFromChange={period.setCompareFrom}
        onCompareToChange={period.setCompareTo}
      />
      {problem && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {problem}
        </Alert>
      )}
      <ReferenceListAlerts
        error={
          query.error ? adminApiErrorMessage(query.error, 'Не вдалося сформувати звіт.') : null
        }
        loading={query.isFetching}
        onRetry={() => void query.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      {report && !problem && (
        <>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {reportPeriodLabel(report.from, report.to)}
            {query.data?.comparison &&
              ` · порівняно з ${reportPeriodLabel(query.data.comparison.from, query.data.comparison.to).toLowerCase()}`}
          </Typography>
          {report.openMonths.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Не закриті в «Зарплаті» місяці рахуються з поточних даних і ще можуть змінитися.
            </Typography>
          )}
          <Tabs
            value={view}
            onChange={(_event, next: View) => setView(next)}
            variant="scrollable"
            sx={{ mb: 2 }}
          >
            {views.map((item) => (
              <Tab key={item.value} value={item.value} label={item.label} />
            ))}
          </Tabs>
          {view === 'overview' && (
            <ReportTotals report={report} comparison={query.data?.comparison ?? null} />
          )}
          {view === 'output' && <ReportOutputTable rows={report.output} />}
          {view === 'staff' && <ReportStaffTable rows={report.staff} />}
          {view === 'materials' && <ReportMaterialsTable rows={report.materials} />}
          {view === 'stock' && <ReportStockTable rows={report.stock} />}
        </>
      )}
    </Box>
  );
}

export default WorkshopReportPage;
