import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { useGetFabricConsumptionQuery } from '@admin/warehouse/data-access';
import { kyivToday } from '@admin/warehouse/model';
import { FabricConsumptionTable } from '@admin/warehouse/ui';
import { Box, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import type { WarehouseTabProps } from '../tabs/warehouse-tab';

/**
 * «Склад тканин › Звіти › Витрата за період» (was the «Зведення витрати» panel of «Рух тканини»):
 * received, issued and corrected per fabric and colour, from the first day of this month by default.
 */
export function FabricConsumptionPage({ title, tabs }: WarehouseTabProps) {
  const today = kyivToday();
  const [from, setFrom] = useState(`${today.slice(0, 8)}01`);
  const [to, setTo] = useState(today);
  const valid = Boolean(from && to && from <= to);
  const report = useGetFabricConsumptionQuery({ from, to }, { skip: !valid });
  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Склад тканин"
        title={title ?? 'Витрата за період'}
        subtitle="Скільки тканини прийшло, видано й скориговано за період."
        actions={null}
      />
      {tabs}
      <Stack direction="row" sx={{ gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          label="З"
          type="date"
          value={from}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(event) => setFrom(event.target.value)}
        />
        <TextField
          size="small"
          label="По"
          type="date"
          value={to}
          error={!valid}
          helperText={valid ? undefined : 'Кінець не раніше початку.'}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(event) => setTo(event.target.value)}
        />
      </Stack>
      <ReferenceListAlerts
        error={report.error ? 'Не вдалося зібрати витрату за період.' : null}
        loading={report.isFetching}
        onRetry={() => void report.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      {report.data && valid && <FabricConsumptionTable consumption={report.data} />}
    </Box>
  );
}

export default FabricConsumptionPage;
