import { Box, Paper, Typography } from '@mui/material';

export interface ReminderMetric {
  label: string;
  value: number | string;
  note?: string;
  tone?: 'success' | 'error';
}

interface Props {
  metrics: readonly ReminderMetric[];
}

/** Bordered strip split into equal cells; values in mono. */
export function ReminderMetricStrip({ metrics }: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: `repeat(${metrics.length}, 1fr)` },
        overflow: 'hidden',
      }}
    >
      {metrics.map((metric, index) => (
        <Box
          key={metric.label}
          sx={{
            p: 2,
            borderLeft: { md: index ? 1 : 0 },
            borderTop: { xs: index > 1 ? 1 : 0, md: 0 },
            borderColor: { xs: 'divider', md: 'divider' },
          }}
        >
          <Typography variant="overline" component="p" sx={{ color: 'text.secondary' }}>
            {metric.label}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--brevi-font-mono)',
              fontVariantNumeric: 'tabular-nums',
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            {metric.value}
          </Typography>
          {metric.note && (
            <Typography
              variant="caption"
              sx={{ color: metric.tone ? `${metric.tone}.main` : 'text.secondary' }}
            >
              {metric.note}
            </Typography>
          )}
        </Box>
      ))}
    </Paper>
  );
}
