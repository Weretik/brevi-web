import { formatDay, formatProductionDate, reportPriceTierLabels } from '@admin/production/model';
import { ReferenceDetailsList } from '@admin/references/ui';
import { Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import type { ProductionOrder } from '@admin/production/model';
import type { ReferenceDetailsItem } from '@admin/references/ui';

/** Who the order is for and where it came from. */
export function ProductionOrderSummary({ order }: { order: ProductionOrder }) {
  const navigate = useNavigate();
  const quoteId = order.quoteId;
  const items: ReferenceDetailsItem[] = [
    { label: 'Клієнт', value: order.clientName },
    {
      label: 'КП',
      value: order.quoteNumber,
      mono: true,
      // An old order from «Цех» keeps only the old КП number; a new one opens its КП.
      onOpen: quoteId === null ? undefined : () => navigate(`/crm/quotes/${quoteId}`),
    },
    { label: 'Менеджер', value: order.managerName },
    { label: 'Дата створення', value: formatDay(order.orderDate), mono: true },
    { label: 'Коментар', value: order.comment },
  ];
  if (order.permissions.seesReportPrice)
    items.push({
      label: 'Ціна для звіту',
      value: order.priceTier ? reportPriceTierLabels[order.priceTier] : null,
    });
  items.push({
    label: 'Створив',
    value: `${order.createdByName} · ${formatProductionDate(order.createdAt)}`,
  });
  if (order.isTransferred) items.push({ label: 'Звідки', value: 'Перенесено зі старого «Цеху»' });
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <ReferenceDetailsList items={items} />
    </Paper>
  );
}
