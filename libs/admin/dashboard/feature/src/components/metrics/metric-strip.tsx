import { Box, Paper, Typography } from '@mui/material';

import { numericTextSx } from '../../model/numeric-text';

import type { DashboardMetric } from '../../model/dashboard-demo';

interface MetricStripProps {
  metrics: readonly DashboardMetric[];
}

/** One bordered strip split into equal metric cells. */
export function MetricStrip({ metrics }: MetricStripProps) {
  return (
    <Paper
      aria-label="Показники"
      component="section"
      variant="outlined"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' },
        overflow: 'hidden',
      }}
    >
      {metrics.map((metric) => (
        <Box
          key={metric.label}
          sx={{
            borderLeft: 1,
            borderTop: 1,
            borderColor: 'divider',
            marginLeft: '-1px',
            marginTop: '-1px',
            px: 2,
            py: 1.75,
          }}
        >
          <Typography color="text.secondary" component="p" variant="overline">
            {metric.label}
          </Typography>
          <Box sx={{ alignItems: 'baseline', display: 'flex', gap: 1, mt: 0.25 }}>
            <Typography component="p" sx={{ ...numericTextSx, fontSize: 22, fontWeight: 600 }}>
              {metric.value}
            </Typography>
            {metric.note ? (
              <Typography
                color={metric.note.tone ? `${metric.note.tone}.main` : 'text.secondary'}
                component="span"
                sx={{ fontSize: 12, fontWeight: metric.note.tone ? 700 : 500 }}
              >
                {metric.note.text}
              </Typography>
            ) : null}
          </Box>
        </Box>
      ))}
    </Paper>
  );
}
