import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { useGetHardwareOrderQuery } from '@admin/warehouse/data-access';
import {
  filterHardware,
  formatKyivTime,
  hardwareViewCounts,
  hardwareViewLabels,
  hardwareViews,
  hardwareWorkbook,
  kyivToday,
  XLSX_MIME_TYPE,
} from '@admin/warehouse/model';
import {
  HardwareIncompleteTable,
  HardwareNeedTable,
  ReportFilterBar,
  ReportStats,
} from '@admin/warehouse/ui';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { Alert, Box, Button, Stack } from '@mui/material';
import { useMemo, useState } from 'react';

import { HardwareNeedDrawer } from '../../components/reports/hardware-need-drawer';
import { useDebouncedValue } from '../../hooks/debounce/use-debounced-value';
import { downloadFile } from '../../hooks/files/download-file';

import type { WarehouseTabProps } from '../tabs/warehouse-tab';
import type { HardwareNeed, HardwareView } from '@admin/warehouse/model';

/**
 * «Склад тканин › Що замовити › Фурнітура» (WH-005, WH-009): the full accessory need of open orders by the
 * composition of their models, the nearest due date first. Stock and issues are not taken off.
 */
export function HardwareOrderPage({ title, tabs }: WarehouseTabProps) {
  const report = useGetHardwareOrderQuery();
  const data = report.data;
  const [search, setSearch] = useState('');
  const debounced = useDebouncedValue(search, 200);
  const [view, setView] = useState<HardwareView>('all');
  const [open, setOpen] = useState<HardwareNeed | null>(null);
  const needs = useMemo(
    () => (data && view !== 'incomplete' ? filterHardware(data.needs, view, debounced) : []),
    [data, view, debounced],
  );
  const counts = data ? hardwareViewCounts(data) : { all: 0, incomplete: 0, unchecked: 0 };
  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Склад тканин"
        title={title ?? 'Фурнітура до замовлення'}
        subtitle={`Повна потреба відкритих замовлень за складом моделей. Складські залишки та видачі не віднімаються.${data ? ` Розраховано ${formatKyivTime(data.calculatedAt)}.` : ''}`}
        actions={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshOutlinedIcon />}
              onClick={() => void report.refetch()}
            >
              Оновити
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadOutlinedIcon />}
              disabled={!data}
              onClick={() =>
                data &&
                downloadFile(
                  hardwareWorkbook(data),
                  `furnitura-do-zamovlennia-${kyivToday()}.xlsx`,
                  XLSX_MIME_TYPE,
                )
              }
            >
              Excel
            </Button>
          </Stack>
        }
      />
      {tabs}
      <ReferenceListAlerts
        error={report.error ? 'Не вдалося порахувати потребу у фурнітурі.' : null}
        loading={report.isFetching}
        onRetry={() => void report.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      {data && (
        <>
          <ReportStats
            stats={[
              { label: 'Позицій фурнітури', value: String(data.needs.length) },
              { label: 'Відкритих завдань', value: String(data.orders) },
              { label: 'Позицій-моделей', value: String(data.items) },
              ...(data.incomplete.length > 0
                ? [
                    {
                      label: 'Неповна потреба',
                      value: `${data.incomplete.length} ряд.`,
                      tone: 'warning' as const,
                      hint: 'Кількість невідома, не враховано',
                    },
                  ]
                : []),
            ]}
          />
          <ReportFilterBar
            search={search}
            searchPlaceholder="Код, назва, примітка, замовник або Ц-12"
            searchLabel="Пошук фурнітури"
            views={hardwareViews}
            labels={hardwareViewLabels}
            counts={counts}
            view={view}
            hideEmpty={['incomplete', 'unchecked']}
            shown={view === 'incomplete' ? null : needs.length}
            onSearch={setSearch}
            onView={setView}
          />
          {view === 'incomplete' ? (
            <>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Для цих рядків складу моделі кількість невідома, тому вони не враховані в потребі
                (не як нуль).
              </Alert>
              <HardwareIncompleteTable rows={data.incomplete} />
            </>
          ) : (
            <HardwareNeedTable
              needs={needs}
              filtered={debounced.trim().length > 0 || view !== 'all'}
              onOpen={setOpen}
            />
          )}
        </>
      )}
      {open && <HardwareNeedDrawer need={open} onClose={() => setOpen(null)} />}
    </Box>
  );
}

export default HardwareOrderPage;
