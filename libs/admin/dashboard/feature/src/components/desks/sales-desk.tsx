import { useListQuotesQuery } from '@admin/quotes/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import AddIcon from '@mui/icons-material/Add';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { recentQuotes } from '../../model/dashboard-view';
import { RecentQuotesCard } from '../quotes/recent-quotes-card';

import type { DashboardViewer } from '../../model/dashboard-view';

const latestQuotes = { search: '', responsibleUserId: null, page: 1, pageSize: 6 };

interface SalesDeskProps {
  viewer: DashboardViewer;
}

/**
 * «Продажі» until the manager desk (DESK-001 stage 2): the latest КП and the quick actions that were on the old home.
 */
export function SalesDesk({ viewer }: SalesDeskProps) {
  const seesQuotes = viewer.canSee('quotes');
  const quotes = useListQuotesQuery(latestQuotes, { skip: !seesQuotes });

  if (!seesQuotes) {
    return (
      <Typography color="text.secondary">
        Для цього столу потрібні права на «Комерційні пропозиції».
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1.25 }}>
        <Button
          component={RouterLink}
          to="/references/counterparties?tab=clients"
          variant="outlined"
        >
          Клієнти
        </Button>
        <Button
          component={RouterLink}
          startIcon={<AddIcon />}
          to="/crm/quotes/new"
          variant="contained"
        >
          Новий розрахунок
        </Button>
      </Stack>
      {quotes.error ? (
        <Alert severity="error">
          {adminApiErrorMessage(quotes.error, 'Не вдалося завантажити КП.')}
        </Alert>
      ) : (
        quotes.data && <RecentQuotesCard quotes={recentQuotes(quotes.data.items)} />
      )}
    </Stack>
  );
}
