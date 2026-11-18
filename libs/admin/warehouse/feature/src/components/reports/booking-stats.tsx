import { bookingToOrderSummary, formatMeters } from '@admin/warehouse/model';
import { ReportStats } from '@admin/warehouse/ui';

import type { BookingReport } from '@admin/warehouse/model';

interface Props {
  data: BookingReport;
  summary: NonNullable<ReturnType<typeof bookingToOrderSummary>>;
}

const plural = (count: number, one: string, few: string, many: string) => {
  const tens = count % 100;
  const units = count % 10;
  if (tens >= 11 && tens <= 14) return many;
  if (units === 1) return one;
  if (units >= 2 && units <= 4) return few;
  return many;
};

/** The figures of «Що замовити»: to order, booked, free and, when there are any, items without a plan. */
export function BookingStats({ data, summary }: Props) {
  return (
    <ReportStats
      stats={[
        {
          label: 'Замовити',
          value: formatMeters(summary.meters),
          tone: summary.meters > 0 ? 'error' : undefined,
          hint:
            summary.pairs > 0
              ? `${summary.pairs} ${plural(summary.pairs, 'пара', 'пари', 'пар')} · ${summary.suppliers} ${plural(summary.suppliers, 'постачальник', 'постачальники', 'постачальників')}`
              : undefined,
        },
        { label: 'У броні', value: formatMeters(data.reserved) },
        { label: 'Вільно на складі', value: formatMeters(data.free) },
        ...(data.unknown.length > 0
          ? [
              {
                label: 'Без плану',
                value: `${data.unknown.length} поз.`,
                tone: 'warning' as const,
                hint: 'Потреба невідома, не враховано',
              },
            ]
          : []),
      ]}
    />
  );
}
