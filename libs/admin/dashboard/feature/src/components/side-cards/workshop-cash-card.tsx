import { Box, Card, Typography } from '@mui/material';

import { formatAmount } from '../../model/dashboard-demo';
import { numericTextSx } from '../../model/numeric-text';

interface WorkshopCashCardProps {
  balance: number;
  weekIncome: number;
  weekExpenses: number;
}

export function WorkshopCashCard({ balance, weekIncome, weekExpenses }: WorkshopCashCardProps) {
  const rows = [
    { label: 'Прихід за тиждень', value: `+${formatAmount(weekIncome)}`, color: 'success.main' },
    { label: 'Витрати за тиждень', value: `−${formatAmount(weekExpenses)}`, color: 'error.main' },
  ];

  return (
    <Card aria-labelledby="workshop-cash-title" component="section" sx={{ p: 2 }}>
      <Typography component="h2" id="workshop-cash-title" sx={{ mb: 1.5 }} variant="h6">
        Каса цеху
      </Typography>
      <Typography component="p" sx={{ ...numericTextSx, fontSize: 28, fontWeight: 600 }}>
        {formatAmount(balance)} ₴
      </Typography>
      <Box sx={{ mt: 1.5 }}>
        {rows.map((row) => (
          <Box
            key={row.label}
            sx={{
              borderTop: 1,
              borderColor: 'divider',
              display: 'flex',
              fontSize: 12.5,
              justifyContent: 'space-between',
              py: 0.875,
            }}
          >
            <Box component="span" sx={{ color: 'text.secondary' }}>
              {row.label}
            </Box>
            <Box component="span" sx={{ ...numericTextSx, color: row.color }}>
              {row.value}
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
