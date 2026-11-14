import {
  useImportProductionWorkMutation,
  useVoidProductionWorkMutation,
} from '@admin/production/data-access';
import { formatWorkMonth, parseProductionWorkImportFile, todayIso } from '@admin/production/model';
import { ProductionWorkTable, WorkLogFilters } from '@admin/production/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { usePageRights } from '@admin/shared/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Box, Button, Stack } from '@mui/material';
import { useState } from 'react';

import { ProductionImportDrawer } from '../../components/import/production-import-drawer';
import { ProductionWorkDrawer } from '../../components/work/production-work-drawer';
import { ProductionWorkVoidDialog } from '../../components/work/production-work-void-dialog';
import { useStockReason } from '../../hooks/stock/use-stock-reason';
import { useWorkLog } from '../../hooks/work/use-work-log';

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
  const [panel, setPanel] = useState<Panel | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const work = useWorkLog(today);
  const { log, choices } = work;
  const [importWork] = useImportProductionWorkMutation();
  const [voidWork] = useVoidProductionWorkMutation();
  const reversal = useStockReason<ProductionWork>(
    (item, reason) => voidWork({ workId: item.id, reason }).unwrap(),
    setMessage,
    'Не вдалося сторнувати роботу.',
  );
  const totals = log.data?.totals;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Швейний цех"
        title="Журнал робіт"
        subtitle={
          totals
            ? `${formatWorkMonth(work.month)}: пошито ${totals.sewn} шт., покроєно ${totals.cut} шт.`
            : 'Хто що пошив або покроїв і за якою розцінкою'
        }
        actions={
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                disabled={!choices}
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
      <WorkLogFilters
        month={work.month}
        canGoForward={work.canGoForward}
        onShiftMonth={work.shiftMonth}
        employees={work.employees}
        employeeId={work.employeeId}
        onEmployeeChange={work.setEmployeeId}
        orders={work.orders}
        orderId={work.orderId}
        onOrderChange={work.setOrderId}
      />
      <ProductionWorkTable
        rows={log.data?.rows ?? []}
        showItem
        busy={reversal.busy}
        canVoid={(row) => work.isOpenOrder(row.orderId)}
        onVoid={rights.canEdit ? reversal.request : undefined}
        empty={log.isLoading ? 'Завантаження…' : 'За цей місяць записів немає.'}
      />
      {panel === 'record' && choices && (
        <ProductionWorkDrawer
          choices={choices}
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
