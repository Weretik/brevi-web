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
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: `repeat(${metrics.length}, 1fr)` },
        overflow: 'hidden',
      }}
    >
      {metrics.map((metric, index) => (
        <Box
          key={metric.label}
          sx={{
            p: 2,
            borderLeft: { xs: index % 2 ? 1 : 0, md: index ? 1 : 0 },
            borderTop: { xs: index > 1 ? 1 : 0, md: 0 },
            borderColor: 'divider',
          }}
        >
          <Typography variant="overline" component="dt" sx={{ color: 'text.secondary' }}>
            {metric.label}
          </Typography>
          <Typography
            component="dd"
            sx={{
              m: 0,
              fontFamily: 'var(--admin-font-mono)',
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
