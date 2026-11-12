import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { useGetFabricMovementsQuery, useGetFabricStockQuery } from '@admin/warehouse/data-access';
import {
  defaultFabricMovementQuery,
  kyivToday,
  movementFilterOf,
  movementPeriodRange,
  withMovementFilter,
} from '@admin/warehouse/model';
import {
  FabricMovementFilters,
  FabricMovementPager,
  FabricMovementsTable,
  MovementCancelDialog,
  WarehouseMoreMenu,
} from '@admin/warehouse/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { Box, Button, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IssueToItemDrawer } from '../../components/item-issue/issue-to-item-drawer';
import { FabricMovementDrawer } from '../../components/movements/fabric-movement-drawer';
import { FabricMovementEditDrawer } from '../../components/movements/fabric-movement-edit-drawer';
import { FabricMovementHistoryDrawer } from '../../components/movements/fabric-movement-history-drawer';
import { FabricIssueDrawer } from '../../components/operations/fabric-issue-drawer';
import { FabricOpeningDrawer } from '../../components/operations/fabric-opening-drawer';
import { FabricReceiptDrawer } from '../../components/operations/fabric-receipt-drawer';
import { useDebouncedValue } from '../../hooks/debounce/use-debounced-value';
import { useMovementCancel } from '../../hooks/movements/use-movement-cancel';
import { useMovementsExport } from '../../hooks/movements/use-movements-export';

import type {
  FabricMovementQuery,
  FabricMovementRow,
  MovementPeriod,
} from '@admin/warehouse/model';

type Panel =
  | { kind: 'receipt' | 'issue' | 'item-issue' | 'opening' }
  | { kind: 'movement' | 'edit' | 'history'; row: FabricMovementRow };

/**
 * «Склад тканин › Рух тканини»: a compact journal of receipts, issues and every other movement, 50 per page, with
 * one search, the kind chips and the period. A row opens its side panel with the actions it allows.
 */
export function FabricMovementsPage() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState<FabricMovementQuery>(() => ({
    ...defaultFabricMovementQuery,
    kind: movementFilterOf(params.get('kind')),
    search: params.get('search')?.trim() ?? '',
  }));
  const [search, setSearch] = useState(() => params.get('search') ?? '');
  const [period, setPeriod] = useState<MovementPeriod>('all');
  const [panel, setPanel] = useState<Panel | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const typed = useDebouncedValue(search.trim());
  useEffect(
    () =>
      setQuery((current) =>
        current.search === typed ? current : withMovementFilter(current, { search: typed }),
      ),
    [typed],
  );
  const movements = useGetFabricMovementsQuery(query);
  const stock = useGetFabricStockQuery();
  const saved = (text: string) => {
    setMessage(text);
    setPanel(null);
  };
  const cancelling = useMovementCancel(saved);
  const exporter = useMovementsExport(setMessage);
  const canMove = Boolean(movements.data?.permissions.canMove ?? stock.data?.permissions.canMove);
  const filtered = Boolean(query.search || query.from || query.to || query.kind !== 'All');
  const choosePeriod = (value: MovementPeriod) => {
    setPeriod(value);
    if (value !== 'custom')
      setQuery((current) => withMovementFilter(current, movementPeriodRange(value, kyivToday())));
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
        search={search}
        counts={movements.data?.counts ?? null}
        period={period}
        onSearch={setSearch}
        onChange={(change) => setQuery((current) => withMovementFilter(current, change))}
        onPeriod={choosePeriod}
      />
      {movements.data && (
        <>
          <FabricMovementsTable
            rows={movements.data.rows}
            filtered={filtered}
            onOpen={(row) => setPanel({ kind: 'movement', row })}
          />
          <FabricMovementPager
            page={query.page}
            hasMore={movements.data.hasMore}
            total={movements.data.total}
            shown={movements.data.rows.length}
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
      {panel?.kind === 'movement' && (
        <FabricMovementDrawer
          row={panel.row}
          canMove={canMove}
          onClose={() => setPanel(null)}
          onEdit={(row) => setPanel({ kind: 'edit', row })}
          onCancel={cancelling.request}
          onHistory={(row) => setPanel({ kind: 'history', row })}
        />
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
      <MovementCancelDialog
        row={cancelling.pending}
        mode={cancelling.mode}
        modes={cancelling.modes}
        reason={cancelling.reason}
        error={cancelling.error}
        busy={cancelling.busy}
        onMode={cancelling.setMode}
        onChange={cancelling.change}
        onClose={cancelling.cancel}
        onConfirm={() => void cancelling.confirm()}
      />
    </Box>
  );
}

export default FabricMovementsPage;
