import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { useGetFabricMovementsQuery, useGetFabricStockQuery } from '@admin/warehouse/data-access';
import {
  defaultFabricMovementQuery,
  formatMeters,
  movementFilterOf,
  withMovementFilter,
} from '@admin/warehouse/model';
import {
  FabricMovementFilters,
  FabricMovementPager,
  FabricMovementsTable,
  StockReasonDialog,
  WarehouseMoreMenu,
} from '@admin/warehouse/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { Box, Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IssueToItemDrawer } from '../../components/item-issue/issue-to-item-drawer';
import { FabricMovementEditDrawer } from '../../components/movements/fabric-movement-edit-drawer';
import { FabricMovementHistoryDrawer } from '../../components/movements/fabric-movement-history-drawer';
import { FabricIssueDrawer } from '../../components/operations/fabric-issue-drawer';
import { FabricOpeningDrawer } from '../../components/operations/fabric-opening-drawer';
import { FabricReceiptDrawer } from '../../components/operations/fabric-receipt-drawer';
import { useMovementReversal } from '../../hooks/movements/use-movement-reversal';
import { useMovementVoid } from '../../hooks/movements/use-movement-void';
import { useMovementsExport } from '../../hooks/movements/use-movements-export';

import type { FabricMovementQuery, FabricMovementRow } from '@admin/warehouse/model';

type Panel =
  | { kind: 'receipt' | 'issue' | 'item-issue' | 'opening' }
  | { kind: 'edit' | 'history'; row: FabricMovementRow };

/** «Склад тканин › Рух тканини»: receipts, one-off issues, issues to items and every movement, 50 per page. */
export function FabricMovementsPage() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState<FabricMovementQuery>(() => ({
    ...defaultFabricMovementQuery,
    kind: movementFilterOf(params.get('kind')),
  }));
  const [panel, setPanel] = useState<Panel | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const movements = useGetFabricMovementsQuery(query);
  const stock = useGetFabricStockQuery();
  const reversal = useMovementReversal(setMessage);
  const voiding = useMovementVoid(setMessage);
  const exporter = useMovementsExport(setMessage);
  const canMove = Boolean(movements.data?.permissions.canMove ?? stock.data?.permissions.canMove);
  const filtered = Boolean(query.fabricCode || query.color || query.kind !== 'All');
  const saved = (text: string) => {
    setMessage(text);
    setPanel(null);
  };

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Склад тканин"
        title="Рух тканини"
        subtitle="Прихід, видача на завдання, разова витрата і вся історія. Нові операції зверху."
        actions={
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            <WarehouseMoreMenu
              actions={[
                ...(canMove
                  ? [
                      {
                        label: 'Разова витрата',
                        secondary: 'Зразок, брак, без завдання',
                        icon: <RemoveOutlinedIcon fontSize="small" />,
                        disabled: !stock.data,
                        onClick: () => setPanel({ kind: 'issue' }),
                      },
                      {
                        label: 'Внести початковий залишок',
                        icon: <InventoryOutlinedIcon fontSize="small" />,
                        onClick: () => setPanel({ kind: 'opening' }),
                      },
                    ]
                  : []),
                {
                  label: exporter.busy ? 'Збираю сторінки…' : 'Вивантажити рух в Excel',
                  icon: <DownloadOutlinedIcon fontSize="small" />,
                  disabled: exporter.busy || !movements.data?.rows.length,
                  onClick: () => void exporter.run(query),
                },
              ]}
            />
            {canMove && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<ContentCutOutlinedIcon />}
                  onClick={() => setPanel({ kind: 'item-issue' })}
                >
                  Видача на завдання
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddOutlinedIcon />}
                  onClick={() => setPanel({ kind: 'receipt' })}
                >
                  Новий прихід
                </Button>
              </>
            )}
          </Stack>
        }
      />
      <ReferenceListAlerts
        error={movements.error ? 'Не вдалося завантажити рух тканини.' : null}
        loading={movements.isFetching}
        onRetry={() => void movements.refetch()}
        actionMessage={message}
        onCloseActionMessage={() => setMessage(null)}
      />
      <FabricMovementFilters
        query={query}
        fabrics={stock.data?.fabrics ?? []}
        onChange={(change) => setQuery((current) => withMovementFilter(current, change))}
      />
      {movements.data && (
        <>
          <FabricMovementsTable
            rows={movements.data.rows}
            filtered={filtered}
            onReverse={canMove ? reversal.request : null}
            onEdit={canMove ? (row) => setPanel({ kind: 'edit', row }) : null}
            onVoid={canMove ? voiding.request : null}
            onHistory={(row) => setPanel({ kind: 'history', row })}
          />
          <FabricMovementPager
            page={query.page}
            hasMore={movements.data.hasMore}
            disabled={movements.isFetching}
            onPage={(page) => setQuery((current) => ({ ...current, page }))}
          />
        </>
      )}
      {panel?.kind === 'receipt' && (
        <FabricReceiptDrawer onClose={() => setPanel(null)} onSaved={setMessage} />
      )}
      {panel?.kind === 'issue' && stock.data && (
        <FabricIssueDrawer
          fabrics={stock.data.fabrics}
          onClose={() => setPanel(null)}
          onSaved={saved}
        />
      )}
      {panel?.kind === 'item-issue' && (
        <IssueToItemDrawer onClose={() => setPanel(null)} onMessage={setMessage} />
      )}
      {panel?.kind === 'opening' && (
        <FabricOpeningDrawer onClose={() => setPanel(null)} onSaved={setMessage} />
      )}
      {panel?.kind === 'edit' && (
        <FabricMovementEditDrawer
          row={panel.row}
          fabrics={stock.data?.fabrics ?? []}
          onClose={() => setPanel(null)}
          onSaved={saved}
        />
      )}
      {panel?.kind === 'history' && (
        <FabricMovementHistoryDrawer
          row={panel.row}
          canMove={canMove}
          onClose={() => setPanel(null)}
          onRestored={saved}
        />
      )}
      <StockReasonDialog
        open={voiding.pending !== null}
        title="Скасувати рух?"
        text={
          voiding.pending
            ? `${voiding.pending.fabricName}, ${voiding.pending.color}: залишок зміниться на ${voiding.pending.delta < 0 ? '+' : ''}${formatMeters(-voiding.pending.delta)}. Запис лишиться в історії як «Скасовано», його можна повернути через «Історія правок».`
            : ''
        }
        confirmLabel="Скасувати рух"
        reason={voiding.reason}
        error={voiding.error}
        busy={voiding.busy}
        onChange={voiding.change}
        onClose={voiding.cancel}
        onConfirm={() => void voiding.confirm()}
      />
      <StockReasonDialog
        open={reversal.pending !== null}
        title="Сторнувати рух?"
        text={
          reversal.pending
            ? `${reversal.pending.fabricName}, ${reversal.pending.color}: рух на ${formatMeters(Math.abs(reversal.pending.delta))} буде відмінено зворотним записом. Обидва записи лишаться в історії.`
            : ''
        }
        confirmLabel="Сторнувати"
        reason={reversal.reason}
        error={reversal.error}
        busy={reversal.busy}
        onChange={reversal.change}
        onClose={reversal.cancel}
        onConfirm={() => void reversal.confirm()}
      />
    </Box>
  );
}

export default FabricMovementsPage;
