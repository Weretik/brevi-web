import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { MetricStrip } from '../components/metrics/metric-strip';
import { RecentQuotesCard } from '../components/quotes/recent-quotes-card';
import { SeamstressLoadCard } from '../components/side-cards/seamstress-load-card';
import { WorkshopCashCard } from '../components/side-cards/workshop-cash-card';
import { WorkshopBoard } from '../components/workshop-board/workshop-board';
import {
  dashboardMetrics,
  demoQuotes,
  seamstressLoads,
  workshopCash,
  workshopStages,
} from '../model/dashboard-demo';

/** Overview «Цех»: visual preview on demo data until the dashboard backend exists. */
export default function DashboardPage() {
  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        sx={{ alignItems: 'flex-end', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between' }}
      >
        <Box>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.25 }}>
            <Typography component="h1" variant="h4">
              Огляд виробництва
            </Typography>
            <Chip color="warning" label="Демо-дані" size="small" variant="outlined" />
          </Stack>
          <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
            Приклад того, як виглядатиме огляд. Реальні дані з'являться разом з бекендом.
          </Typography>
        </Box>
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
      </Stack>
      <MetricStrip metrics={dashboardMetrics} />
      <WorkshopBoard stages={workshopStages} />
      <Box
        sx={{
          alignItems: 'start',
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 340px' },
        }}
      >
        <RecentQuotesCard quotes={demoQuotes} />
        <Stack spacing={2}>
          <WorkshopCashCard
            balance={workshopCash.balance}
            weekExpenses={workshopCash.weekExpenses}
            weekIncome={workshopCash.weekIncome}
          />
          <SeamstressLoadCard loads={seamstressLoads} />
        </Stack>
      </Box>
    </Stack>
  );
}
