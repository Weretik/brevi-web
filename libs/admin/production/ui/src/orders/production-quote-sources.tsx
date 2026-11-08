import { formatProductionDate } from '@admin/production/model';
import { Alert, List, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';

import type { ProductionQuoteSource } from '@admin/production/model';

interface Props {
  sources: readonly ProductionQuoteSource[];
  loading: boolean;
  onPick: (source: ProductionQuoteSource) => void;
}

/** КП «під запит» to pass to the workshop (saved or sent); an already passed КП says how many orders it has. */
export function ProductionQuoteSources({ sources, loading, onPick }: Props) {
  if (!loading && sources.length === 0)
    return (
      <Alert severity="info">
        Немає КП під запит. Завдання створюється з КП «під запит», збереженого в «Комерційні
        пропозиції».
      </Alert>
    );
  return (
    <Paper variant="outlined">
      <List disablePadding aria-label="КП під запит">
        {sources.map((source) => (
          <ListItemButton key={source.id} divider onClick={() => onPick(source)}>
            <ListItemText
              primary={`${source.number} · ${source.clientName}`}
              secondary={
                source.lastSentAt
                  ? `${source.responsibleName} · відправлено ${formatProductionDate(source.lastSentAt)}`
                  : source.responsibleName
              }
            />
            {source.ordersCount > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 2, whiteSpace: 'nowrap' }}
              >
                Завдань: {source.ordersCount}
              </Typography>
            )}
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}
