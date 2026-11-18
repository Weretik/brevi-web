import { IssueToItemDrawer } from '../../components/item-issue/issue-to-item-drawer';
import { FabricAdjustmentDrawer } from '../../components/operations/fabric-adjustment-drawer';
import { FabricIssueDrawer } from '../../components/operations/fabric-issue-drawer';
import { FabricOpeningDrawer } from '../../components/operations/fabric-opening-drawer';
import { FabricReceiptDrawer } from '../../components/operations/fabric-receipt-drawer';
import { FabricStockPairDrawer } from '../../components/stock/fabric-stock-pair-drawer';
import { StockTransferDrawer } from '../../components/transfer/stock-transfer-drawer';

import type { useFabricStockPage } from '../../hooks/stock/use-fabric-stock-page';

interface Props {
  page: ReturnType<typeof useFabricStockPage>;
}

/** The side panels of «Залишки»; one is open at a time. */
export function FabricStockPanels({ page }: Props) {
  const { panel, setPanel, data, canMove, saved, setMessage } = page;
  return (
    <>
      {panel?.kind === 'pair' && (
        <FabricStockPairDrawer
          pair={panel.pair}
          canMove={canMove}
          onClose={() => setPanel(null)}
          onAdjust={(pair) => setPanel({ kind: 'adjust', pair })}
          onReceive={() => setPanel({ kind: 'receipt' })}
        />
      )}
      {panel?.kind === 'adjust' && (
        <FabricAdjustmentDrawer
          key={`${panel.pair.fabric.fabricCode}|${panel.pair.color.colorKey}`}
          pair={panel.pair}
          onClose={() => setPanel(null)}
          onSaved={saved}
        />
      )}
      {panel?.kind === 'receipt' && (
        <FabricReceiptDrawer onClose={() => setPanel(null)} onSaved={setMessage} />
      )}
      {panel?.kind === 'issue' && data && (
        <FabricIssueDrawer fabrics={data.fabrics} onClose={() => setPanel(null)} onSaved={saved} />
      )}
      {panel?.kind === 'item-issue' && (
        <IssueToItemDrawer onClose={() => setPanel(null)} onMessage={setMessage} />
      )}
      {panel?.kind === 'opening' && (
        <FabricOpeningDrawer onClose={() => setPanel(null)} onSaved={setMessage} />
      )}
      {panel?.kind === 'transfer' && <StockTransferDrawer onClose={() => setPanel(null)} />}
    </>
  );
}
