import { PRODUCTION_DUE_SOON_DAYS, ordersWord } from '@admin/production/model';
import { Alert, Button } from '@mui/material';

import type { ProductionOrderAttention as Attention } from '@admin/production/model';

interface Props {
  attention: Attention;
  /** The list already shows only these orders. */
  active: boolean;
  onShow: () => void;
  onReset: () => void;
}

const overdueText = (count: number) =>
  `${count} ${ordersWord(count)} ${count === 1 ? 'прострочене' : 'прострочені'}`;
const soonText = (count: number) =>
  `${count} ${ordersWord(count)} ${count === 1 ? 'має' : 'мають'} термін у найближчі ${PRODUCTION_DUE_SOON_DAYS} дні`;

/** Shown only when «Нове» orders are overdue or due within three days; nothing is shown when all is on time. */
export function ProductionOrderAttention({ attention, active, onShow, onReset }: Props) {
  const { overdue, dueSoon } = attention;
  if (overdue === 0 && dueSoon === 0) return null;
  const parts = [overdue > 0 ? overdueText(overdue) : null, dueSoon > 0 ? soonText(dueSoon) : null];
  return (
    <Alert
      severity={overdue > 0 ? 'error' : 'warning'}
      sx={{ mb: 1.5, alignItems: 'center', fontWeight: 600 }}
      action={
        <Button color="inherit" size="small" onClick={active ? onReset : onShow}>
          {active ? 'Усі завдання' : 'Показати'}
        </Button>
      }
    >
      {parts.filter(Boolean).join(', ')}
    </Alert>
  );
}
