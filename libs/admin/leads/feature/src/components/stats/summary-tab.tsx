import { leadStatsPeriods } from '@admin/leads/model';
import {
  LeadIndustriesTable,
  LeadManagersTable,
  LeadResultsBars,
  LeadStatsMetrics,
  LeadSyncCard,
} from '@admin/leads/ui';
import { ReferenceFilterChip } from '@admin/references/ui';
import { Alert, Box, Button, CircularProgress, Stack } from '@mui/material';

import type { LeadStatsState } from '../../hooks/stats/use-lead-stats';

/** «Зведення»: replaces the sheet «Сводка», counted by the server without formulas. */
export function SummaryTab({ state }: { state: LeadStatsState }) {
  const stats = state.stats;
  return (
    <Stack sx={{ gap: 2 }}>
      <Stack direction="row" sx={{ gap: 0.75, flexWrap: 'wrap' }} role="group" aria-label="Період">
        {leadStatsPeriods.map((item) => (
          <ReferenceFilterChip
            key={item.period}
            label={item.label}
            selected={state.period === item.period}
            onClick={() => state.setPeriod(item.period)}
          />
        ))}
      </Stack>
      {state.error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={state.retry}>
              Повторити
            </Button>
          }
        >
          {state.error}
        </Alert>
      )}
      {state.syncError && (
        <Alert severity="error" onClose={state.clearSyncError}>
          {state.syncError}
        </Alert>
      )}
      <LeadStatsMetrics stats={stats} />
      {state.loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={28} aria-label="Завантаження зведення" />
        </Box>
      ) : (
        stats && (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(0, 1fr)' },
                gap: 2,
                alignItems: 'start',
              }}
            >
              <LeadManagersTable stats={stats} />
              <LeadResultsBars stats={stats} />
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(0, 1fr)' },
                gap: 2,
                alignItems: 'start',
              }}
            >
              <LeadIndustriesTable stats={stats} />
              <LeadSyncCard sync={stats.sync} />
            </Box>
          </>
        )
      )}
    </Stack>
  );
}
