import { ReferenceListAlerts, ReferencePageHeader, ReferenceSearchBar } from '@admin/references/ui';
import { useGetFabricConsumptionQuery } from '@admin/warehouse/data-access';
import {
  consumptionPeriods,
  filterConsumption,
  formatMeters,
  formatMoney,
  kyivToday,
  movementPeriodRange,
} from '@admin/warehouse/model';
import { FabricConsumptionTable, PeriodChip, ReportStats } from '@admin/warehouse/ui';
import { Alert, Box, Stack } from '@mui/material';
import { useMemo, useState } from 'react';

import { useDebouncedValue } from '../../hooks/debounce/use-debounced-value';

import type { WarehouseTabProps } from '../tabs/warehouse-tab';
import type { ConsumptionSortKey, MovementPeriod } from '@admin/warehouse/model';

/**
 * «Склад тканин › Звіти › Витрата за період» (WH-010): what came in, what went to tasks, one-off and corrections per
 * pair, «Цей місяць» by default; totals above, the table sorts.
 */
export function FabricConsumptionPage({ title, tabs }: WarehouseTabProps) {
  const today = kyivToday();
  const [period, setPeriod] = useState<MovementPeriod>('month');
  const [dates, setDates] = useState(() => movementPeriodRange('month', today));
  const [search, setSearch] = useState('');
  const debounced = useDebouncedValue(search, 200);
  const [sort, setSort] = useState<{ key: ConsumptionSortKey; descending: boolean }>({
    key: 'issuedToTasks',
    descending: true,
  });
  const from = dates.from;
  const to = dates.to;
  const valid = Boolean(from && to && from <= to);
  const report = useGetFabricConsumptionQuery(
    { from: from ?? today, to: to ?? today },
    { skip: !valid },
  );
  const data = valid ? report.data : undefined;
  const rows = useMemo(
    () => (data ? filterConsumption(data.rows, debounced, sort.key, sort.descending) : []),
    [data, debounced, sort],
  );
  const seesValue = data?.issuedValue !== null && data?.issuedValue !== undefined;
  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Склад тканин"
        title={title ?? 'Витрата за період'}
        subtitle="Скільки тканини прийшло, видано на завдання, витрачено разово й уточнено за період."
        actions={null}
      />
      {tabs}
      <Stack direction="row" sx={{ mb: 2 }}>
        <PeriodChip
          periods={consumptionPeriods}
          period={period}
          from={from}
          to={to}
          onPeriod={(next) => {
            setPeriod(next);
            if (next !== 'custom') setDates(movementPeriodRange(next, today));
          }}
          onDates={setDates}
        />
      </Stack>
      {!valid && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Вкажіть обидві дати; кінець не раніше початку.
        </Alert>
      )}
      <ReferenceListAlerts
        error={report.error ? 'Не вдалося зібрати витрату за період.' : null}
        loading={report.isFetching}
        onRetry={() => void report.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      {data && (
        <>
          <ReportStats
            stats={[
              { label: 'Прийшло', value: formatMeters(data.received) },
              {
                label: 'Видано на завдання',
                value: formatMeters(data.issuedToTasks),
                hint: seesValue ? `усього видано на ${formatMoney(data.issuedValue)}` : undefined,
              },
              { label: 'Разова витрата', value: formatMeters(data.oneOff) },
              {
                label: 'Уточнення',
                value: `${data.corrected > 0 ? '+' : ''}${formatMeters(data.corrected)}`,
              },
            ]}
          />
          <ReferenceSearchBar
            placeholder="Тканина, код або колір"
            label="Пошук у «Витрата за період»"
            value={search}
            onChange={setSearch}
          />
          <FabricConsumptionTable
            rows={rows}
            seesValue={seesValue}
            filtered={debounced.trim().length > 0}
            sort={sort}
            onSort={(key) =>
              setSort((current) =>
                current.key === key
                  ? { key, descending: !current.descending }
                  : { key, descending: key !== 'name' },
              )
            }
          />
        </>
      )}
    </Box>
  );
}

export default FabricConsumptionPage;
