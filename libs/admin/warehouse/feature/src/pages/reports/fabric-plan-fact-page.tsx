import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { useGetFabricPlanFactQuery } from '@admin/warehouse/data-access';
import { formatMeters, formatPerProduct, planFactResultLabels } from '@admin/warehouse/model';
import { PlanFactTable, ReportStats } from '@admin/warehouse/ui';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { Alert, Box, Button, Paper, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import type { WarehouseTabProps } from '../tabs/warehouse-tab';
import type { PlanFactFilter } from '@admin/warehouse/model';

const empty: PlanFactFilter = { model: '', client: '', fabric: '' };

/**
 * «Склад тканин › План і факт» (WH-005): main fabric by model for the items whose fabric was issued
 * for all their products. One item that cannot be compared makes the difference unknown.
 */
export function FabricPlanFactPage({ title, tabs }: WarehouseTabProps) {
  const [draft, setDraft] = useState<PlanFactFilter>(empty);
  const [filter, setFilter] = useState<PlanFactFilter>(empty);
  const report = useGetFabricPlanFactQuery(filter);
  const data = report.data;
  const field = (key: keyof PlanFactFilter, label: string) => (
    <TextField
      size="small"
      label={label}
      value={draft[key]}
      onChange={(event) => setDraft({ ...draft, [key]: event.target.value })}
      slotProps={{ htmlInput: { maxLength: 200 } }}
      sx={{ flex: 1, minWidth: 160 }}
    />
  );
  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Склад тканин"
        title={title ?? 'План і факт'}
        subtitle="План і факт основної тканини за моделями: лише завдання, тканину яких видано на всі вироби."
        actions={
          <Button
            variant="outlined"
            startIcon={<RefreshOutlinedIcon />}
            onClick={() => void report.refetch()}
          >
            Оновити
          </Button>
        }
      />
      {tabs}
      <Paper
        variant="outlined"
        component="form"
        sx={{ p: 1.5, mb: 2 }}
        onSubmit={(event) => {
          event.preventDefault();
          setFilter(draft);
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          {field('model', 'Модель')}
          {field('client', 'Замовник')}
          {field('fabric', 'Тканина')}
          <Button type="submit" variant="contained">
            Показати
          </Button>
        </Stack>
      </Paper>
      <ReferenceListAlerts
        error={report.error ? 'Не вдалося порахувати план і факт.' : null}
        loading={report.isFetching}
        onRetry={() => void report.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      {data && (
        <>
          <ReportStats
            stats={[
              { label: 'Замовлень', value: String(data.total.orders) },
              { label: 'Виробів', value: String(data.total.products) },
              {
                label: 'План / факт на виріб',
                value: `${formatPerProduct(data.total.planPerProduct)} / ${formatPerProduct(data.total.factPerProduct)}`,
              },
              {
                label: 'Різниця разом',
                value:
                  data.total.difference === null
                    ? planFactResultLabels[data.total.result]
                    : formatMeters(data.total.difference),
                tone: data.total.result === 'NeedsCheck' ? 'warning' : undefined,
                hint:
                  data.total.uncomparableItems > 0
                    ? `Без оцінки завдань: ${data.total.uncomparableItems}`
                    : undefined,
              },
            ]}
          />
          {data.total.uncomparableItems > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {data.total.uncomparableItems} завдань не можна порівняти (немає плану, видача без
              кількості виробів або тканина без ролі), тому загальна різниця невідома. Розгорніть
              модель, щоб побачити причину.
            </Alert>
          )}
          {data.inProgressItems > 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Ще не видано на всі вироби: {data.inProgressItems} завдань. Вони зʼявляться тут після
              повної видачі.
            </Alert>
          )}
          <PlanFactTable report={data} />
        </>
      )}
    </Box>
  );
}

export default FabricPlanFactPage;
