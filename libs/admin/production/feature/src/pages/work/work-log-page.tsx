import {
  useGetWorkChoicesQuery,
  useGetWorkLogQuery,
  useImportProductionWorkMutation,
  useVoidProductionWorkMutation,
} from '@admin/production/data-access';
import {
  formatWorkMonth,
  parseProductionWorkImportFile,
  shiftWorkMonth,
  todayIso,
  workMonth,
} from '@admin/production/model';
import { ProductionWorkTable } from '@admin/production/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { usePageRights } from '@admin/shared/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Autocomplete, Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

import { ProductionImportDrawer } from '../../components/import/production-import-drawer';
import { ProductionWorkDrawer } from '../../components/work/production-work-drawer';
import { ProductionWorkVoidDialog } from '../../components/work/production-work-void-dialog';
import { useStockReason } from '../../hooks/stock/use-stock-reason';

import type { ProductionOrderActor, ProductionWork } from '@admin/production/model';

interface Props {
  /** May the person import the old «Цех» log. */
  useOrderActor: () => ProductionOrderActor;
}

type Panel = 'record' | 'import';

/** «Швейний цех › Журнал робіт»: who sewed or cut how much, by month. */
export function WorkLogPage({ useOrderActor }: Props) {
  const rights = usePageRights();
  const { canCreate } = rights;
  const actor = useOrderActor();
  const today = todayIso();
  const [month, setMonth] = useState(() => workMonth(today));
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const log = useGetWorkLogQuery({ month, employeeId, orderId });
  const choices = useGetWorkChoicesQuery();
  const [importWork] = useImportProductionWorkMutation();
  const [voidWork] = useVoidProductionWorkMutation();
  const reversal = useStockReason<ProductionWork>(
    (work, reason) => voidWork({ workId: work.id, reason }).unwrap(),
    setMessage,
    'Не вдалося сторнувати роботу.',
  );
  const openOrders = useMemo(
    () => new Set((choices.data?.items ?? []).map((item) => item.orderId)),
    [choices.data],
  );
  const orders = useMemo(() => {
    const byId = new Map<number, { id: number; label: string }>();
    for (const row of log.data?.rows ?? [])
      byId.set(row.orderId, { id: row.orderId, label: `№ ${row.orderNumber} · ${row.clientName}` });
    for (const item of choices.data?.items ?? [])
      byId.set(item.orderId, {
        id: item.orderId,
        label: `№ ${item.orderNumber} · ${item.clientName}`,
      });
    return [...byId.values()].sort((a, b) => a.label.localeCompare(b.label, 'uk'));
  }, [log.data, choices.data]);
  const employees = choices.data?.employees ?? [];
  const totals = log.data?.totals;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Швейний цех"
        title="Журнал робіт"
        subtitle={
          totals
            ? `${formatWorkMonth(month)}: пошито ${totals.sewn} шт., покроєно ${totals.cut} шт.`
            : 'Хто що пошив або покроїв і за якою розцінкою'
        }
        actions={
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                disabled={!choices.data}
                onClick={() => setPanel('record')}
              >
                Додати роботу
              </Button>
            )}
            {actor.canImport && canCreate && (
              <Button
                variant="outlined"
                startIcon={<UploadFileOutlinedIcon />}
                onClick={() => setPanel('import')}
              >
                Імпорт
              </Button>
            )}
          </Stack>
        }
      />
      <ReferenceListAlerts
        error={
          log.error ? adminApiErrorMessage(log.error, 'Не вдалося завантажити журнал робіт.') : null
        }
        loading={log.isFetching}
        onRetry={() => void log.refetch()}
        actionMessage={message}
        onCloseActionMessage={() => setMessage(null)}
      />
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{ gap: 1.5, mb: 2, alignItems: { md: 'center' } }}
      >
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
          <IconButton
            aria-label="Попередній місяць"
            onClick={() => setMonth(shiftWorkMonth(month, -1))}
          >
            <ChevronLeftOutlinedIcon />
          </IconButton>
          <Typography sx={{ minWidth: 140, textAlign: 'center', fontWeight: 600 }}>
            {formatWorkMonth(month)}
          </Typography>
          <IconButton
            aria-label="Наступний місяць"
            disabled={month >= workMonth(today)}
            onClick={() => setMonth(shiftWorkMonth(month, 1))}
          >
            <ChevronRightOutlinedIcon />
          </IconButton>
        </Stack>
        <Autocomplete
          size="small"
          sx={{ minWidth: 240 }}
          options={employees}
          value={employees.find((x) => x.id === employeeId) ?? null}
          getOptionLabel={(option) => option.fullName}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(_event, value) => setEmployeeId(value?.id ?? null)}
          renderInput={(params) => <TextField {...params} label="Працівник" />}
        />
        <Autocomplete
          size="small"
          sx={{ minWidth: 280 }}
          options={orders}
          value={orders.find((x) => x.id === orderId) ?? null}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(_event, value) => setOrderId(value?.id ?? null)}
          renderInput={(params) => <TextField {...params} label="Завдання" />}
        />
      </Stack>
      <ProductionWorkTable
        rows={log.data?.rows ?? []}
        showItem
        busy={reversal.busy}
        canVoid={(row) => openOrders.has(row.orderId)}
        onVoid={rights.canEdit ? reversal.request : undefined}
        empty={log.isLoading ? 'Завантаження…' : 'За цей місяць записів немає.'}
      />
      {panel === 'record' && choices.data && (
        <ProductionWorkDrawer
          choices={choices.data}
          item={null}
          onClose={() => setPanel(null)}
          onSaved={(text) => {
            setPanel(null);
            setMessage(text);
          }}
        />
      )}
      {panel === 'import' && (
        <ProductionImportDrawer
          title="Імпорт журналу робіт"
          description="Файл production-work.json зі старого «Цеху». Спершу перевіримо, потім збережемо."
          keyLabel="Працівник"
          detailLabel="Робота"
          parse={parseProductionWorkImportFile}
          send={(rows, dryRun) => importWork({ file: rows[0], dryRun }).unwrap()}
          onClose={() => setPanel(null)}
        />
      )}
      <ProductionWorkVoidDialog reversal={reversal} />
    </Box>
  );
}

export default WorkLogPage;
