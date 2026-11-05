import { useGetWorkshopDashboardQuery } from '@admin/production/data-access';
import { useListQuotesQuery } from '@admin/quotes/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import AddIcon from '@mui/icons-material/Add';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { MetricStrip } from '../components/metrics/metric-strip';
import { RecentQuotesCard } from '../components/quotes/recent-quotes-card';
import { WeekHoursCard } from '../components/side-cards/week-hours-card';
import { WorkshopBoard } from '../components/workshop-board/workshop-board';
import {
  recentQuotes,
  weekHours,
  workshopMetrics,
  workshopStages,
} from '../model/dashboard-view';

import type { DashboardViewer } from '../model/dashboard-view';

const latestQuotes = { archived: false, search: '', responsibleUserId: null, page: 1, pageSize: 6 };

interface DashboardPageProps {
  useViewer: () => DashboardViewer;
}

/** «Огляд виробництва»: the workshop board, late and ready orders, the latest КП (PRD-D50). */
export default function DashboardPage({ useViewer }: DashboardPageProps) {
  const viewer = useViewer();
  const workshop = useGetWorkshopDashboardQuery(undefined, { skip: !viewer.seesWorkshop });
  const quotes = useListQuotesQuery(latestQuotes, { skip: !viewer.seesQuotes });
  const dashboard = workshop.data;
  const hours = dashboard?.hours ?? null;

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        sx={{ alignItems: 'flex-end', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between' }}
      >
        <Box>
          <Typography component="h1" variant="h4">
            Огляд виробництва
          </Typography>
          {dashboard && (
            <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
              Завдання в роботі за етапом найповільнішої позиції.
            </Typography>
          )}
        </Box>
        {viewer.seesQuotes && (
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
        )}
      </Stack>
      {workshop.error && (
        <Alert severity="error">
          {adminApiErrorMessage(workshop.error, 'Не вдалося завантажити дані цеху.')}
        </Alert>
      )}
      {dashboard && (
        <>
          <MetricStrip metrics={workshopMetrics(dashboard)} />
          <WorkshopBoard stages={workshopStages(dashboard)} />
        </>
      )}
      {(viewer.seesQuotes || hours) && (
        <Box
          sx={{
            alignItems: 'start',
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              lg: viewer.seesQuotes && hours ? 'minmax(0, 1fr) 340px' : '1fr',
            },
          }}
        >
          {viewer.seesQuotes &&
            (quotes.error ? (
              <Alert severity="error">
                {adminApiErrorMessage(quotes.error, 'Не вдалося завантажити КП.')}
              </Alert>
            ) : (
              quotes.data && <RecentQuotesCard quotes={recentQuotes(quotes.data.items)} />
            ))}
          {hours && <WeekHoursCard rows={weekHours(hours)} />}
        </Box>
      )}
      {!viewer.seesWorkshop && !viewer.seesQuotes && (
        <Typography color="text.secondary">
          Оберіть розділ у меню ліворуч.
        </Typography>
      )}
    </Stack>
  );
}
