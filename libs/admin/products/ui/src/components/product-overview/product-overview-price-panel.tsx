import { ReferenceFormSection } from '@admin/references/ui';
import { Alert, Box, Button, CircularProgress, Skeleton, Typography } from '@mui/material';

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
  /** «Перерахувати ціни» of one sewing model; absent for PPE. */
  onRecalculate?: () => void;
  recalculating?: boolean;
}

/** Side panel block (CAT-011 design C): materials, labour, cost and price date, two per row. */
export function ProductOverviewPricePanel({
  metrics,
  loading,
  error,
  blockers,
  onRecalculate,
  recalculating = false,
}: Props) {
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
      {onRecalculate && (
        <Button
          variant="outlined"
          disabled={recalculating}
          startIcon={recalculating ? <CircularProgress size={18} color="inherit" /> : undefined}
          onClick={onRecalculate}
        >
          {recalculating ? 'Рахуємо…' : 'Перерахувати ціни'}
        </Button>
      )}
    </ReferenceFormSection>
  );
}
