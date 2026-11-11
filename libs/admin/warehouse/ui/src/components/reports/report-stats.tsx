import { Box, Paper, Typography } from '@mui/material';

export interface ReportStat {
  label: string;
  value: string;
  /** Marks a figure that needs attention (something to order, a shortage). */
  tone?: 'error' | 'warning';
  hint?: string;
}

/** The summary figures above a report. */
export function ReportStats({ stats }: { stats: readonly ReportStat[] }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(180px, 1fr))' },
        gap: 1.5,
        mb: 2,
      }}
    >
      {stats.map((stat) => (
        <Paper key={stat.label} variant="outlined" sx={{ p: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            {stat.label}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontVariantNumeric: 'tabular-nums',
              color: stat.tone ? `${stat.tone}.main` : undefined,
            }}
          >
            {stat.value}
          </Typography>
          {stat.hint && (
            <Typography variant="caption" color="text.secondary" component="div">
              {stat.hint}
            </Typography>
          )}
        </Paper>
      ))}
    </Box>
  );
}
