import { Box, LinearProgress, Link, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { numericTextSx } from '../../model/numeric-text';

import type { WorkshopOrder } from '../../model/dashboard-view';

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

  return (
    <Paper component="li" sx={{ listStyle: 'none', px: 1.5, py: 1.25 }} variant="outlined">
      <Box
        sx={{ ...numericTextSx, display: 'flex', fontSize: 11.5, justifyContent: 'space-between' }}
      >
        <Link component={RouterLink} to={`/production/orders/${order.id}`} underline="hover">
          {order.number}
        </Link>
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
        aria-label={`Пошито ${order.number}`}
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
          пошито {order.progress}%
        </Box>
      </Box>
    </Paper>
  );
}
