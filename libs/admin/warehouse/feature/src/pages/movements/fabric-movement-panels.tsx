import { IssueToItemDrawer } from '../../components/item-issue/issue-to-item-drawer';
import { FabricMovementDrawer } from '../../components/movements/fabric-movement-drawer';
import { FabricMovementEditDrawer } from '../../components/movements/fabric-movement-edit-drawer';
import { FabricMovementHistoryDrawer } from '../../components/movements/fabric-movement-history-drawer';
import { FabricIssueDrawer } from '../../components/operations/fabric-issue-drawer';
import { FabricOpeningDrawer } from '../../components/operations/fabric-opening-drawer';
import { FabricReceiptDrawer } from '../../components/operations/fabric-receipt-drawer';

import type { FabricMovementRow, FabricStockFabric } from '@admin/warehouse/model';

export type FabricMovementPanel =
  | { kind: 'receipt' | 'issue' | 'item-issue' | 'opening' }
  | { kind: 'movement' | 'edit' | 'history'; row: FabricMovementRow };

interface Props {
  panel: FabricMovementPanel | null;
  /** Fabrics of the stock; null while loading. */
  fabrics: readonly FabricStockFabric[] | null;
  /** Changing, cancelling or restoring a movement is allowed. */
  canChange: boolean;
  onPanel: (panel: FabricMovementPanel | null) => void;
  /** Saved: show the message and close the panel. */
  onSaved: (message: string) => void;
  onMessage: (message: string) => void;
  onCancel: (row: FabricMovementRow) => void;
}

/** The side panels of «Рух тканини»; one is open at a time. */
export function FabricMovementPanels({
  panel,
  fabrics,
  canChange,
  onPanel,
  onSaved,
  onMessage,
  onCancel,
}: Props) {
  return (
    <>
      {panel?.kind === 'receipt' && (
        <FabricReceiptDrawer onClose={() => onPanel(null)} onSaved={onMessage} />
      )}
      {panel?.kind === 'issue' && fabrics && (
        <FabricIssueDrawer fabrics={fabrics} onClose={() => onPanel(null)} onSaved={onSaved} />
      )}
      {panel?.kind === 'item-issue' && (
        <IssueToItemDrawer onClose={() => onPanel(null)} onMessage={onMessage} />
      )}
      {panel?.kind === 'opening' && (
        <FabricOpeningDrawer onClose={() => onPanel(null)} onSaved={onMessage} />
      )}
      {panel?.kind === 'movement' && (
        <FabricMovementDrawer
          row={panel.row}
          canMove={canChange}
          onClose={() => onPanel(null)}
          onEdit={(row) => onPanel({ kind: 'edit', row })}
          onCancel={onCancel}
          onHistory={(row) => onPanel({ kind: 'history', row })}
        />
      )}
      {panel?.kind === 'edit' && (
        <FabricMovementEditDrawer
          row={panel.row}
          fabrics={fabrics ?? []}
          onClose={() => onPanel(null)}
          onSaved={onSaved}
        />
      )}
      {panel?.kind === 'history' && (
        <FabricMovementHistoryDrawer
          row={panel.row}
          canMove={canChange}
          onClose={() => onPanel(null)}
          onRestored={onSaved}
        />
      )}
    </>
  );
}
