import { adminApiErrorMessage } from '@admin/shared/api-client';
import {
  useGetFabricStockQuery,
  useGetItemFabricQuery,
  useRefreshItemFabricPlanMutation,
} from '@admin/warehouse/data-access';
import { formatDay } from '@admin/warehouse/model';
import { ItemFabricCard, StockReasonDialog } from '@admin/warehouse/ui';
import { Alert, LinearProgress } from '@mui/material';
import { useState } from 'react';

import { ItemIssueDrawer } from './item-issue-drawer';
import { useIssueReversal } from '../../hooks/item-issue/use-issue-reversal';

import type { ItemFabricScope } from '@admin/warehouse/data-access';

interface Props {
  orderId: number;
  itemId: number;
  /** «orders» in «Виробничі завдання», «stock» in «Склад тканин». */
  scope: ItemFabricScope;
  onMessage: (message: string) => void;
}

/** The fabric card of an item with «Видати тканину», «Оновити план» and «Сторно видачі». */
export function ItemFabricSection({ orderId, itemId, scope, onMessage }: Props) {
  const { data, isLoading, error } = useGetItemFabricQuery({ orderId, itemId, scope });
  const [issuing, setIssuing] = useState(false);
  const stock = useGetFabricStockQuery(undefined, { skip: !issuing });
  const [refresh, refreshing] = useRefreshItemFabricPlanMutation();
  const reversal = useIssueReversal(data, onMessage);

  async function refreshPlan() {
    if (!data) return;
    try {
      await refresh({
        orderId,
        itemId,
        body: { orderVersion: data.orderVersion, planVersion: data.planVersion },
      }).unwrap();
      onMessage('План оновлено за поточною нормою.');
    } catch (failure) {
      onMessage(adminApiErrorMessage(failure, 'Не вдалося оновити план.'));
    }
  }

  if (isLoading) return <LinearProgress />;
  if (error || !data) return <Alert severity="error">Не вдалося завантажити тканину.</Alert>;
  const busy = reversal.busy || refreshing.isLoading;
  return (
    <>
      <ItemFabricCard
        fabric={data}
        busy={busy}
        onIssue={data.canIssue ? () => setIssuing(true) : undefined}
        onRefreshPlan={data.canIssue ? () => void refreshPlan() : undefined}
        onReverse={data.canIssue ? reversal.request : undefined}
      />
      {issuing && stock.isFetching && <LinearProgress />}
      {issuing && stock.error && <Alert severity="error">Не вдалося завантажити залишки.</Alert>}
      {issuing && stock.data && (
        <ItemIssueDrawer
          card={data}
          fabrics={stock.data.fabrics}
          onClose={() => setIssuing(false)}
          onSaved={(message) => {
            setIssuing(false);
            onMessage(message);
          }}
        />
      )}
      <StockReasonDialog
        open={reversal.pending !== null}
        title="Сторнувати видачу?"
        text={
          reversal.pending
            ? `Видача ${formatDay(reversal.pending.issuedOn)} повернеться на склад, а план знову заброниться.`
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
    </>
  );
}
