import { useGetFinanceOverviewQuery } from '@admin/accounting/data-access';
import { useGetPurchaseInvoicesQuery } from '@admin/purchasing/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import {
  accountingMetrics,
  invoiceProblems,
  mainCurrency,
  monthSoFar,
  reviewList,
  topExpenses,
} from '../../model/accounting-view';
import { DeskListCard } from '../desk-list/desk-list-card';
import { MetricStrip } from '../metrics/metric-strip';

import type { DashboardViewer } from '../../model/dashboard-view';

interface AccountingDeskProps {
  viewer: DashboardViewer;
  /** yyyy-mm-dd of today; the month runs from its first day to today. */
  today: string;
}

/**
 * «Робочий стіл бухгалтера» (DESK-001 stage 4): the balance and this month of the current books, what waits for
 * review, where the money went and «Рахунки на закупку» with problems. Each block needs its own page of «Права
 * доступу».
 */
export function AccountingDesk({ viewer, today }: AccountingDeskProps) {
  const sees = {
    books: viewer.canSee('accounting'),
    invoices: viewer.canSee('purchase-invoices'),
  };
  const month = monthSoFar(today);
  const overview = useGetFinanceOverviewQuery(
    { from: month.from, to: month.to, scope: 'Current' },
    { skip: !sees.books },
  );
  const invoices = useGetPurchaseInvoicesQuery(
    { page: 1, pageSize: 25, search: '', filter: 'NeedsReview' },
    { skip: !sees.invoices },
  );

  if (!sees.books && !sees.invoices) {
    return (
      <Typography color="text.secondary">
        Для цього столу потрібні права на «Бухгалтерію» або «Рахунки на закупку». Їх відкриває
        директор на сторінці «Права доступу».
      </Typography>
    );
  }

  const data = overview.data;
  const money = data ? mainCurrency(data) : null;
  const review = data ? reviewList(data) : null;
  const expenses = money ? topExpenses(money) : null;
  const problems = invoices.data ? invoiceProblems(invoices.data.items) : null;
  const errors = [
    overview.error &&
      adminApiErrorMessage(overview.error, 'Не вдалося завантажити огляд бухгалтерії.'),
    invoices.error &&
      adminApiErrorMessage(invoices.error, 'Не вдалося завантажити рахунки на закупку.'),
  ].filter((text): text is string => Boolean(text));

  return (
    <Stack spacing={2}>
      {sees.books && (
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1.25 }}>
          <Button component={RouterLink} to="/accounting/transactions" variant="contained">
            Операції
          </Button>
          <Button component={RouterLink} to="/accounting/statements" variant="outlined">
            Виписки
          </Button>
          <Button component={RouterLink} to="/accounting/reports" variant="outlined">
            Звіти
          </Button>
        </Stack>
      )}
      {errors.map((text) => (
        <Alert key={text} severity="error">
          {text}
        </Alert>
      ))}
      {money && <MetricStrip metrics={accountingMetrics(money, month.name)} />}
      <Box
        sx={{
          alignItems: 'start',
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        {review && review.rows.length > 0 && (
          <DeskListCard
            id="finance-review"
            link={{ label: 'Перевірка', to: '/accounting/review' }}
            list={review}
            title="Потребують перевірки"
          />
        )}
        {problems && problems.rows.length > 0 && (
          <DeskListCard
            id="invoice-problems"
            link={{ label: 'Рахунки на закупку', to: '/accounting/purchase-invoices' }}
            list={problems}
            moreText={(more) => `І ще ${more} — у «Рахунки на закупку».`}
            title="Рахунки на закупку з проблемами"
          />
        )}
        {expenses && expenses.rows.length > 0 && (
          <DeskListCard
            id="top-expenses"
            link={{ label: 'Огляд', to: '/accounting/overview' }}
            list={expenses}
            title={`Куди пішли гроші: ${month.name}`}
          />
        )}
      </Box>
    </Stack>
  );
}
