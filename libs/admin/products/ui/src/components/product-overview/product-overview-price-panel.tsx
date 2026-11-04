import { ReferenceFormSection } from '@admin/references/ui';
import { Alert, Box, Skeleton, Typography } from '@mui/material';

export interface ProductPanelMetric {
  label: string;
  value: string;
}

interface Props {
  metrics: readonly ProductPanelMetric[];
  loading: boolean;
  error: string | null;
  /** Reasons the price cannot be calculated. */
  blockers: readonly string[];
}

/** Side panel block (CAT-011 design C): materials, labour, cost and price date, two per row. */
export function ProductOverviewPricePanel({ metrics, loading, error, blockers }: Props) {
  return (
    <ReferenceFormSection title="Ціни і собівартість">
      {error && <Alert severity="error">{error}</Alert>}
      <Box
        component="dl"
        sx={{ m: 0, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1 }}
      >
        {metrics.map((metric) => (
          <Box key={metric.label} sx={{ p: 1.5, borderRadius: 1, bgcolor: 'action.hover' }}>
            <Typography variant="caption" component="dt" color="text.secondary">
              {metric.label}
            </Typography>
            <Typography
              component="dd"
              sx={{
                m: 0,
                fontFamily: 'var(--admin-font-mono)',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 600,
              }}
            >
              {loading ? <Skeleton width="70%" /> : metric.value}
            </Typography>
          </Box>
        ))}
      </Box>
      {blockers.length > 0 && (
        <Alert severity="warning">Не розраховано: {blockers.join(', ')}.</Alert>
      )}
    </ReferenceFormSection>
  );
}
