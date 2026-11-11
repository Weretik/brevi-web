import { formatHours, formatMoney } from '@admin/production/model';
import { Box, Typography } from '@mui/material';

import type { PayrollTotals } from '@admin/production/model';

interface Props {
  totals: PayrollTotals;
}

const mono = { fontFamily: 'var(--admin-font-mono)' } as const;

/** What the month comes to: hours, accrued, paid and still due. */
export function PayrollMonthKpis({ totals }: Props) {
  const items = [
    { label: 'Години', value: formatHours(totals.minutes) },
    { label: 'Нараховано', value: formatMoney(totals.accrued) },
    { label: 'Виплачено', value: formatMoney(totals.paid) },
    { label: 'До видачі', value: formatMoney(totals.due), strong: true },
  ];
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1,
        gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
      }}
    >
      {items.map((item) => (
        <Box
          key={item.label}
          sx={{ border: 1, borderColor: 'divider', borderRadius: 1, px: 1.5, py: 1 }}
        >
          <Typography variant="caption" color="text.secondary">
            {item.label}
          </Typography>
          <Typography variant="h6" sx={{ ...mono, fontWeight: item.strong ? 700 : 600 }}>
            {item.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
