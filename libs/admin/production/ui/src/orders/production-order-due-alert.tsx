import { formatDay } from '@admin/production/model';
import { Alert } from '@mui/material';

import type { ProductionDueItem, ProductionOrderOverview } from '@admin/production/model';

const daysWord = (days: number) => {
  const tens = days % 100;
  const ones = days % 10;
  if (tens >= 11 && tens <= 14) return 'днів';
  if (ones === 1) return 'день';
  if (ones >= 2 && ones <= 4) return 'дні';
  return 'днів';
};

const late = ({ item, days }: ProductionDueItem) =>
  `«${item.modelName}» мала бути готова ${formatDay(item.dueDate)} (${days} ${daysWord(days)} тому)`;

const soon = ({ item, days }: ProductionDueItem) =>
  `«${item.modelName}» — ${days === 0 ? 'сьогодні' : `через ${days} ${daysWord(days)}`}`;

/** Shown only when an open item is late or due within three days; an order on time shows nothing. */
export function ProductionOrderDueAlert({ overview }: { overview: ProductionOrderOverview }) {
  if (overview.overdue.length > 0)
    return (
      <Alert severity="error" sx={{ mb: 2, fontWeight: 600 }}>
        Прострочено: {overview.overdue.map(late).join('; ')}.
      </Alert>
    );
  if (overview.soon.length > 0)
    return (
      <Alert severity="warning" sx={{ mb: 2, fontWeight: 600 }}>
        Термін горить: {overview.soon.map(soon).join('; ')}.
      </Alert>
    );
  return null;
}
