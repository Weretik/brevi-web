import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { usePageRights } from '@admin/shared/ui';
import { useGetFabricMovementsQuery, useGetFabricStockQuery } from '@admin/warehouse/data-access';
import {
  FabricMovementFilters,
  FabricMovementPager,
  FabricMovementsTable,
  MovementCancelDialog,
} from '@admin/warehouse/ui';
import { Box } from '@mui/material';
import { useState } from 'react';

import { FabricMovementPanels } from './fabric-movement-panels';
import { FabricMovementsActions } from './fabric-movements-actions';
import { useMovementCancel } from '../../hooks/movements/use-movement-cancel';
import { useMovementFilters } from '../../hooks/movements/use-movement-filters';
import { useMovementsExport } from '../../hooks/movements/use-movements-export';

import type { FabricMovementPanel as Panel } from './fabric-movement-panels';

/**
 * «Склад тканин › Рух тканини»: a compact journal of receipts, issues and every other movement, 50 per page, with
 * one search, the kind chips and the period. A row opens its side panel with the actions it allows.
 */
export function FabricMovementsPage() {
  const filters = useMovementFilters();
  const { query } = filters;
  const [panel, setPanel] = useState<Panel | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const movements = useGetFabricMovementsQuery(query);
  const stock = useGetFabricStockQuery();
  const saved = (text: string) => {
    setMessage(text);
    setPanel(null);
  };
  const cancelling = useMovementCancel(saved);
  const exporter = useMovementsExport(setMessage);
  const rights = usePageRights();
  const canMoveStock = Boolean(
    movements.data?.permissions.canMove ?? stock.data?.permissions.canMove,
  );
  // New operations need «Створення»; changing, cancelling or restoring a movement needs «Редагування».
  const canMove = canMoveStock && rights.canCreate;
  const canChange = canMoveStock && rights.canEdit;
  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Склад тканин"
        title="Рух тканини"
        subtitle="Прихід, видача на завдання, разова витрата і вся історія. Нові операції зверху."
        actions={
          <FabricMovementsActions
            canMove={canMove}
            stockReady={Boolean(stock.data)}
            exporting={exporter.busy}
            canExport={Boolean(movements.data?.rows.length)}
            onPanel={setPanel}
            onExport={() => void exporter.run(query)}
          />
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
        search={filters.search}
        counts={movements.data?.counts ?? null}
        period={filters.period}
        onSearch={filters.setSearch}
        onChange={filters.change}
        onPeriod={filters.choosePeriod}
      />
      {movements.data && (
        <>
          <FabricMovementsTable
            rows={movements.data.rows}
            filtered={filters.filtered}
            onOpen={(row) => setPanel({ kind: 'movement', row })}
          />
          <FabricMovementPager
            page={query.page}
            hasMore={movements.data.hasMore}
            total={movements.data.total}
            shown={movements.data.rows.length}
            disabled={movements.isFetching}
            onPage={filters.setPage}
          />
        </>
      )}
      <FabricMovementPanels
        panel={panel}
        fabrics={stock.data?.fabrics ?? null}
        canChange={canChange}
        onPanel={setPanel}
        onSaved={saved}
        onMessage={setMessage}
        onCancel={cancelling.request}
      />
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
