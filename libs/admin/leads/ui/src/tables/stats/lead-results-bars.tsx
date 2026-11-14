import { Box, Typography } from '@mui/material';

import { LeadStatsEmpty, num } from './lead-stats-cells';
import { LeadStatsCard } from '../../components/stats/lead-stats-card';

import type { LeadStats } from '@admin/leads/model';

/** «Результати дзвінків» of the period as bars. */
export function LeadResultsBars({ stats }: { stats: LeadStats }) {
  const max = Math.max(1, ...stats.results.map((x) => x.count));
  return (
    <LeadStatsCard title="Результати дзвінків">
      {stats.results.length === 0 ? (
        <LeadStatsEmpty text="За період дзвінків немає" />
      ) : (
        <Box
          component="ul"
          sx={{ listStyle: 'none', m: 0, px: 2, py: 1.75, display: 'grid', gap: 1.25 }}
        >
          {stats.results.map((row) => (
            <Box
              component="li"
              key={row.name}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(120px, 170px) minmax(0, 1fr) 36px',
                gap: 1.25,
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" noWrap title={row.name}>
                {row.name}
              </Typography>
              <Box sx={{ height: 8, borderRadius: 999, bgcolor: 'action.hover' }} aria-hidden>
                <Box
                  sx={{
                    height: 8,
                    borderRadius: 999,
                    bgcolor: 'primary.main',
                    width: `${(row.count / max) * 100}%`,
                  }}
                />
              </Box>
              <Typography variant="body2" sx={num}>
                {row.count}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </LeadStatsCard>
  );
}
