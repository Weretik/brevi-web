import { Box, ButtonBase, Paper, Typography } from '@mui/material';

export interface CardMetric {
  readonly label: string;
  /** undefined while loading: shows «—». */
  readonly value: number | string | undefined;
  /** A short line under the value, for example «2 прострочено». */
  readonly note?: string;
  readonly tone?: 'error';
  /** Opens the tab with the full list. */
  readonly onOpen?: () => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** The metric strip of a card's «Огляд»: one bordered paper split into cells. */
export function CardMetricStrip({ metrics }: { metrics: readonly CardMetric[] }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: `repeat(${Math.min(metrics.length, 6)}, 1fr)`,
        },
        overflow: 'hidden',
      }}
    >
      {metrics.map((metric) => (
        <ButtonBase
          key={metric.label}
          disabled={!metric.onOpen}
          onClick={metric.onOpen}
          aria-label={metric.onOpen ? `${metric.label}: відкрити список` : undefined}
          sx={{
            display: 'block',
            textAlign: 'left',
            px: 2,
            py: 1.5,
            borderLeft: 1,
            borderTop: 1,
            borderColor: 'divider',
            ml: '-1px',
            mt: '-1px',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <Typography variant="overline" component="p" color="text.secondary">
            {metric.label}
          </Typography>
          <Typography sx={{ ...mono, fontSize: 22, fontWeight: 600 }}>
            {metric.value ?? '—'}
          </Typography>
          {metric.note && (
            <Box
              component="span"
              sx={{
                typography: 'caption',
                color: metric.tone === 'error' ? 'error.main' : 'text.secondary',
              }}
            >
              {metric.note}
            </Box>
          )}
        </ButtonBase>
      ))}
    </Paper>
  );
}
