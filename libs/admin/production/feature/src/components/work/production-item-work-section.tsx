import {
  useGetProductionItemWorkQuery,
  useGetWorkChoicesQuery,
  useVoidProductionWorkMutation,
} from '@admin/production/data-access';
import { ProductionItemWorkPanel } from '@admin/production/ui';
import { Alert, LinearProgress } from '@mui/material';
import { useState } from 'react';

import { ProductionWorkDrawer } from './production-work-drawer';
import { ProductionWorkVoidDialog } from './production-work-void-dialog';
import { useStockReason } from '../../hooks/stock/use-stock-reason';

import type { ProductionItem, ProductionOrder, ProductionWork } from '@admin/production/model';

interface Props {
  order: ProductionOrder;
  item: ProductionItem;
  onMessage: (message: string) => void;
}

/** «Робота» of an item in the order card: plan sewn and cut, records, «Додати роботу» and «Сторно». */
export function ProductionItemWorkSection({ order, item, onMessage }: Props) {
  const { data, isLoading, error } = useGetProductionItemWorkQuery({
    orderId: order.id,
    itemId: item.id,
  });
  const [recording, setRecording] = useState(false);
  const choices = useGetWorkChoicesQuery(undefined, { skip: !recording });
  const [voidWork] = useVoidProductionWorkMutation();
  const reversal = useStockReason<ProductionWork>(
    (work, reason) => voidWork({ workId: work.id, reason }).unwrap(),
    onMessage,
    'Не вдалося сторнувати роботу.',
  );

  if (isLoading) return <LinearProgress />;
  if (error || !data) return <Alert severity="error">Не вдалося завантажити роботу.</Alert>;
  return (
    <>
      <ProductionItemWorkPanel
        work={data}
        busy={reversal.busy}
        onRecord={data.canRecord ? () => setRecording(true) : undefined}
        onVoid={data.canRecord ? reversal.request : undefined}
      />
      {recording && choices.isFetching && <LinearProgress />}
      {recording && choices.error && (
        <Alert severity="error">Не вдалося завантажити працівників.</Alert>
      )}
      {recording && choices.data && (
        <ProductionWorkDrawer
          choices={choices.data}
          item={{
            orderId: order.id,
            orderNumber: order.number,
            clientName: order.clientName,
            itemId: item.id,
            modelName: item.modelName,
            quantity: data.quantity,
            sewn: data.sewn,
            cut: data.cut,
            sewingRate: data.sewingRate,
          }}
          onClose={() => setRecording(false)}
          onSaved={(message) => {
            setRecording(false);
            onMessage(message);
          }}
        />
      )}
      <ProductionWorkVoidDialog reversal={reversal} />
    </>
  );
}
