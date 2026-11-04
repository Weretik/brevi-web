import { Box, Paper, Typography } from '@mui/material';

export interface SewingCardMetric {
  label: string;
  value: string;
  note?: string;
  tone?: 'success' | 'warning';
}

interface Props {
  metrics: readonly SewingCardMetric[];
}

/** Metric strip of the sewing card: equal cells split by dividers, values in mono. */
export function SewingCardMetricStrip({ metrics }: Props) {
  return (
    <Paper
      variant="outlined"
      component="dl"
      sx={{
        m: 0,
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          md: `repeat(${Math.min(metrics.length, 3)}, 1fr)`,
          lg: `repeat(${metrics.length}, 1fr)`,
        },
        // 1px gaps over the divider colour draw the cell borders at every column count.
        gap: '1px',
        bgcolor: 'divider',
        overflow: 'hidden',
      }}
    >
      {metrics.map((metric) => (
        <Box key={metric.label} sx={{ p: 2, bgcolor: 'background.paper', minWidth: 0 }}>
          <Typography variant="overline" component="dt" sx={{ color: 'text.secondary' }}>
            {metric.label}
          </Typography>
          <Typography
            component="dd"
            sx={{
              m: 0,
              fontFamily: 'var(--admin-font-mono)',
              fontVariantNumeric: 'tabular-nums',
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            {metric.value}
          </Typography>
          {metric.note && (
            <Typography
              variant="caption"
              component="dd"
              sx={{ m: 0, color: metric.tone ? `${metric.tone}.main` : 'text.secondary' }}
            >
              {metric.note}
            </Typography>
          )}
        </Box>
      ))}
    </Paper>
  );
}
