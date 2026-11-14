import { Box, Paper, Typography } from '@mui/material';

import { mono } from '../mono';

import type { LeadStats } from '@admin/leads/model';

/** Metric strip of «Зведення»: now-state of the funnel, then the period. */
export function LeadStatsMetrics({ stats }: { stats: LeadStats | undefined }) {
  const value = (n: number | undefined) => (n === undefined ? '—' : String(n));
  const cells = [
    { label: 'Усього лідів', value: value(stats?.total) },
    { label: 'Вільні', value: value(stats?.free) },
    { label: 'У роботі', value: value(stats?.inWork) },
    { label: 'Пропозиції', value: value(stats?.offer) },
    { label: 'Стали клієнтами', value: value(stats?.clients) },
    { label: 'Прострочено', value: value(stats?.overdue), danger: Boolean(stats?.overdue) },
    { label: 'Дзвінків за період', value: value(stats?.callsInPeriod) },
    { label: 'Нових за період', value: value(stats?.addedInPeriod) },
  ];
  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(8, 1fr)' },
        overflow: 'hidden',
      }}
    >
      {cells.map((cell) => (
        <Box
          key={cell.label}
          sx={{
            px: 2,
            py: 1.5,
            borderLeft: 1,
            borderTop: 1,
            borderColor: 'divider',
            ml: '-1px',
            mt: '-1px',
          }}
        >
          <Typography variant="overline" component="p" color="text.secondary">
            {cell.label}
          </Typography>
          <Typography
            sx={{
              ...mono,
              fontSize: 22,
              fontWeight: 600,
              color: cell.danger ? 'error.main' : 'text.primary',
            }}
          >
            {cell.value}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
}
