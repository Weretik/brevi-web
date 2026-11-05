import { useGetWorkshopReportQuery } from '@admin/production/data-access';
import {
  payrollMonthOf,
  previousReportPeriod,
  reportPeriodLabel,
  reportPeriodProblem,
  todayIso,
} from '@admin/production/model';
import {
  ReportMaterialsTable,
  ReportOutputTable,
  ReportStaffTable,
  ReportStockTable,
  ReportTotals,
} from '@admin/production/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

type View = 'overview' | 'output' | 'staff' | 'materials' | 'stock';

const views: { value: View; label: string }[] = [
  { value: 'overview', label: 'Огляд' },
  { value: 'output', label: 'Випуск' },
  { value: 'staff', label: 'Працівники' },
  { value: 'materials', label: 'Видані матеріали' },
  { value: 'stock', label: 'Залишки' },
];

function MonthField({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: string;
  max: string;
  onChange: (value: string) => void;
}) {
  return (
    <TextField
      label={label}
      type="month"
      size="small"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{ inputLabel: { shrink: true }, htmlInput: { max } }}
      sx={{ width: 170 }}
    />
  );
}

/** «Швейний цех › Звіти цеху» (Admin): output, pay, fabric and stock of whole months, with a comparison. */
export function WorkshopReportPage() {
  const current = payrollMonthOf(todayIso());
  const [from, setFrom] = useState(current);
  const [to, setTo] = useState(current);
  const [compare, setCompare] = useState(false);
  const [view, setView] = useState<View>('overview');
  const previous = previousReportPeriod(from, to);
  const [compareFrom, setCompareFrom] = useState(previous?.from ?? current);
  const [compareTo, setCompareTo] = useState(previous?.to ?? current);
  const problem =
    reportPeriodProblem(from, to, current) ??
    (compare ? reportPeriodProblem(compareFrom, compareTo, current) : null);
  const query = useGetWorkshopReportQuery(
    compare ? { from, to, compareFrom, compareTo } : { from, to },
    { skip: problem !== null },
  );
  const report = query.data?.current;

  const setPeriod = (nextFrom: string, nextTo: string) => {
    setFrom(nextFrom);
    setTo(nextTo);
    const before = previousReportPeriod(nextFrom, nextTo);
    if (before) {
      setCompareFrom(before.from);
      setCompareTo(before.to);
    }
  };

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Швейний цех"
        title="Звіти цеху"
        subtitle="Випуск за цінами КП, нарахування, видана тканина й залишки за цілі місяці."
        actions={null}
      />
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1.5, alignItems: 'center', mb: 2 }}>
        <MonthField
          label="Від"
          value={from}
          max={current}
          onChange={(value) => setPeriod(value, to)}
        />
        <MonthField
          label="До"
          value={to}
          max={current}
          onChange={(value) => setPeriod(from, value)}
        />
        <FormControlLabel
          control={
            <Checkbox checked={compare} onChange={(event) => setCompare(event.target.checked)} />
          }
          label="Порівняти з"
        />
        {compare && (
          <>
            <MonthField label="Від" value={compareFrom} max={current} onChange={setCompareFrom} />
            <MonthField label="До" value={compareTo} max={current} onChange={setCompareTo} />
          </>
        )}
      </Stack>
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
