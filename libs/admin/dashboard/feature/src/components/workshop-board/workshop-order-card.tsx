import { Box, LinearProgress, Paper, Typography } from '@mui/material';

import { numericTextSx } from '../../model/numeric-text';

import type { WorkshopOrder } from '../../model/dashboard-demo';

const visuallyHiddenSx = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
} as const;

interface WorkshopOrderCardProps {
  order: WorkshopOrder;
}

export function WorkshopOrderCard({ order }: WorkshopOrderCardProps) {
  const isReady = order.progress >= 100;

  return (
    <Paper component="li" sx={{ listStyle: 'none', px: 1.5, py: 1.25 }} variant="outlined">
      <Box
        sx={{ ...numericTextSx, display: 'flex', fontSize: 11.5, justifyContent: 'space-between' }}
      >
        <Box component="span" sx={{ color: 'text.secondary' }}>
          {order.number}
        </Box>
        <Box
          component="span"
          sx={{
            color: order.overdue ? 'error.main' : 'text.secondary',
            fontWeight: order.overdue ? 700 : 400,
          }}
        >
          {order.overdue ? (
            <Box component="span" sx={visuallyHiddenSx}>
              прострочено{' '}
            </Box>
          ) : null}
          {order.due}
        </Box>
      </Box>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mt: 0.5 }}>{order.product}</Typography>
      <Typography color="text.secondary" sx={{ fontSize: 12.5 }}>
        {order.client} · {order.quantity} шт
      </Typography>
      <LinearProgress
        aria-label={`Готовність ${order.number}`}
        sx={{ bgcolor: 'action.hover', borderRadius: 2, height: 4, mb: 0.75, mt: 1.25 }}
        value={order.progress}
        variant="determinate"
      />
      <Box
        sx={{
          color: 'text.secondary',
          display: 'flex',
          fontSize: 11.5,
          justifyContent: 'space-between',
        }}
      >
        <Box component="span" sx={numericTextSx}>
          {order.progress}%
        </Box>
        <span>{isReady ? 'до відвантаження' : 'в роботі'}</span>
      </Box>
    </Paper>
  );
}
