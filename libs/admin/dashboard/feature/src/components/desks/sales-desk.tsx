import AddIcon from '@mui/icons-material/Add';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { useSalesDesk } from '../../hooks/use-sales-desk';
import { recentQuotes } from '../../model/desk-views/dashboard-view';
import { callQueue } from '../../model/desk-views/sales-view';
import { DeskGrid } from '../desk-grid/desk-grid';
import { DeskListCard } from '../desk-list/desk-list-card';
import { MetricStrip } from '../metrics/metric-strip';
import { RecentQuotesCard } from '../quotes/recent-quotes-card';

import type { DashboardViewer } from '../../model/desk-views/dashboard-view';

interface SalesDeskProps {
  viewer: DashboardViewer;
  /** yyyy-mm-dd of today; a later due date is not late. */
  today: string;
}

/**
 * «Робочий стіл менеджера» (DESK-001 stage 2): «Мій день» of leads, the tasks that burn, own КП and own orders in the
 * workshop, with the quick actions. Each block needs its own page of «Права доступу».
 */
export function SalesDesk({ viewer, today }: SalesDeskProps) {
  const desk = useSalesDesk(viewer, today);
  const { sees } = desk;

  if (desk.blocked) {
    return (
      <Typography color="text.secondary">
        Для цього столу потрібні права на «Ліди», «Мої завдання», КП або «Виробничі завдання».
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1.25 }}>
        {sees.clients && (
          <Button
            component={RouterLink}
            to="/references/counterparties?tab=clients"
            variant="outlined"
          >
            Клієнти
          </Button>
        )}
        {sees.embroidery && (
          <Button component={RouterLink} to="/crm/embroidery" variant="outlined">
            Ціна вишивки
          </Button>
        )}
        {sees.quotes && (
          <Button
            component={RouterLink}
            startIcon={<AddIcon />}
            to="/crm/quotes/new"
            variant="contained"
          >
            Новий розрахунок
          </Button>
        )}
      </Stack>
      {desk.errors.map((text) => (
        <Alert key={text} severity="error">
          {text}
        </Alert>
      ))}
      {desk.metrics.length > 0 && <MetricStrip metrics={desk.metrics} />}
      <DeskGrid columns={2}>
        {desk.day && (
          <DeskListCard
            empty="На сьогодні дзвінків у черзі немає."
            id="call-queue"
            link={{ label: 'Ліди', to: '/crm/leads' }}
            list={callQueue(desk.day)}
            moreText={(more) => `І ще ${more} у черзі.`}
            title="Черга дзвінків"
          />
        )}
        {desk.burning && desk.burning.rows.length > 0 && (
          <DeskListCard
            id="burning-tasks"
            link={{ label: 'Мої завдання', to: '/crm/tasks' }}
            list={desk.burning}
            moreText={(more) => `І ще ${more} — у «Мої завдання».`}
            title="Завдання, що горять"
          />
        )}
        {desk.quotes && (
          <RecentQuotesCard quotes={recentQuotes(desk.quotes.items)} title="Мої КП" />
        )}
        {desk.own && desk.own.rows.length > 0 && (
          <DeskListCard
            id="my-orders"
            link={{ label: 'Виробничі завдання', to: '/production/orders' }}
            list={desk.own}
            moreText={(more) => `І ще ${more} — у «Виробничі завдання».`}
            title="Мої замовлення в цеху"
          />
        )}
      </DeskGrid>
    </Stack>
  );
}
