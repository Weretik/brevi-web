import {
  useGetFabricStockChoicesQuery,
  useGetProductionItemFabricQuery,
  useReverseFabricIssueMutation,
} from '@admin/production/data-access';
import { formatDay } from '@admin/production/model';
import { ProductionItemFabricPanel, ProductionReasonDialog } from '@admin/production/ui';
import { Alert, LinearProgress } from '@mui/material';
import { useState } from 'react';

import { FabricIssueDrawer } from './fabric-issue-drawer';
import { useStockReason } from '../../hooks/stock/use-stock-reason';

import type { FabricIssue, ProductionItem } from '@admin/production/model';

interface Props {
  orderId: number;
  item: ProductionItem;
  onMessage: (message: string) => void;
}

/** «Тканина» of an item in the order card: plan by colour, issues, «Видати» and «Сторно видачі». */
export function ProductionItemFabricSection({ orderId, item, onMessage }: Props) {
  const { data, isLoading, error } = useGetProductionItemFabricQuery({ orderId, itemId: item.id });
  const [issuing, setIssuing] = useState(false);
  const choices = useGetFabricStockChoicesQuery(undefined, { skip: !issuing });
  const [reverse] = useReverseFabricIssueMutation();
  const reversal = useStockReason<FabricIssue>(
    (issue, reason) =>
      reverse({
        orderId,
        issueId: issue.id,
        orderVersion: data?.orderVersion ?? 0,
        reason,
      }).unwrap(),
    onMessage,
    'Не вдалося сторнувати видачу.',
  );

  if (isLoading) return <LinearProgress />;
  if (error || !data) return <Alert severity="error">Не вдалося завантажити тканину.</Alert>;
  return (
    <>
      <ProductionItemFabricPanel
        fabric={data}
        busy={reversal.busy}
        onIssue={data.canIssue ? () => setIssuing(true) : undefined}
        onReverse={data.canIssue ? reversal.request : undefined}
      />
      {issuing && choices.isFetching && <LinearProgress />}
      {issuing && choices.error && <Alert severity="error">Не вдалося завантажити тканини.</Alert>}
      {issuing && choices.data && (
        <FabricIssueDrawer
          modelName={item.modelName}
          fabric={data}
          fabrics={choices.data.fabrics}
          onClose={() => setIssuing(false)}
          onSaved={(message) => {
            setIssuing(false);
            onMessage(message);
          }}
        />
      )}
      <ProductionReasonDialog
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
