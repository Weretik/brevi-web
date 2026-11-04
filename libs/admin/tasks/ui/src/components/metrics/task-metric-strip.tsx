import { Box, Paper, Typography } from '@mui/material';

import type { TaskOverview } from '@admin/tasks/model';

interface Props {
  overview: TaskOverview | undefined;
  /** The manager board shows three cells, the admin page five. */
  compact?: boolean;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** Metric strip of the task pages: values in mono, a note only when something needs attention. */
export function TaskMetricStrip({ overview, compact = false }: Props) {
  const value = (number: number | null | undefined, suffix = '') =>
    overview === undefined || number === null || number === undefined ? '—' : `${number}${suffix}`;
  const cells = [
    { label: 'Відкриті', value: value(overview?.open) },
    ...(compact
      ? []
      : [
          {
            label: 'Прострочені',
            value: value(overview?.overdue),
            note: overview?.overdue ? 'треба реакція' : undefined,
            danger: Boolean(overview?.overdue),
          },
          { label: 'Термінові', value: value(overview?.urgent) },
        ]),
    { label: 'Виконано за тиждень', value: value(overview?.doneLastWeek) },
    { label: 'Вчасно', value: value(overview?.onTimePercent, '%') },
  ];

  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: `repeat(${cells.length}, 1fr)` },
        overflow: 'hidden',
      }}
    >
      {cells.map((cell, index) => (
        <Box
          key={cell.label}
          sx={{
            px: 2,
            py: 1.5,
            borderLeft: { md: index ? 1 : 0 },
            borderTop: { xs: index > 1 ? 1 : 0, md: 0 },
            borderColor: 'divider',
          }}
        >
          <Typography variant="overline" component="p" sx={{ color: 'text.secondary' }}>
            {cell.label}
          </Typography>
          <Typography
            sx={{
              ...mono,
              fontSize: 22,
              fontWeight: 600,
              color: 'danger' in cell && cell.danger ? 'error.main' : 'text.primary',
            }}
          >
            {cell.value}
          </Typography>
          {'note' in cell && cell.note && (
            <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 600 }}>
              {cell.note}
            </Typography>
          )}
        </Box>
      ))}
    </Paper>
  );
}
