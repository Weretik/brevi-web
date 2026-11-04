import { Alert, Box, Paper, Typography } from '@mui/material';

import type { ProductionOrderChange } from '@admin/production/model';

const time = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'short', timeStyle: 'short' });

/** «Історія змін»: who changed which field, from what to what, newest first. */
export function ProductionOrderHistory({ changes }: { changes: readonly ProductionOrderChange[] }) {
  if (changes.length === 0) return <Alert severity="info">Змін ще не було.</Alert>;
  return (
    <Paper variant="outlined" component="ol" sx={{ m: 0, p: 0, listStyle: 'none' }}>
      {changes.map((change, index) => (
        <Box
          component="li"
          key={change.id}
          sx={{ px: 2, py: 1.5, borderTop: index === 0 ? 0 : 1, borderColor: 'divider' }}
        >
          <Typography variant="body2" color="text.secondary">
            {time.format(new Date(change.at))} · {change.actorName}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {change.itemName ? `${change.itemName}: ` : ''}
            {change.field}
          </Typography>
          {(change.before !== null || change.after !== null) && (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              {change.before !== null && (
                <Box
                  component="span"
                  sx={{ color: 'text.secondary', textDecoration: 'line-through' }}
                >
                  {change.before}
                </Box>
              )}
              {change.before !== null && change.after !== null && ' → '}
              {change.after ?? (change.before !== null ? 'порожньо' : '')}
            </Typography>
          )}
        </Box>
      ))}
    </Paper>
  );
}
