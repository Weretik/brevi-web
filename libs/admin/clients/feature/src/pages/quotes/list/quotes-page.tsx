import { useListQuotesQuery } from '@admin/clients/data-access';
import { QuotesTable } from '@admin/clients/ui';
import { Alert, Box, Button, CircularProgress, Pagination, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { QuoteAdvancedFilters } from '../../../components/quotes/list/quote-advanced-filters';
import { QuoteListFilters } from '../../../components/quotes/list/quote-list-filters';
import { quoteError } from '../../../errors/quotes/quote-error';
import { quoteListQuery } from '../../../mappers/quotes/quote-list-query';

export default function QuotesPage({ archivedView = false }: { archivedView?: boolean }) {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [advanced, setAdvanced] = useState(false);
  const request = quoteListQuery(params, archivedView);
  const { search = '', state, page, archived } = request;
  const query = useListQuotesQuery(request);
  const data = query.currentData;
  const change = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next);
  };
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={2}>
        <Typography component="h1" variant="h4">
          {archived ? 'Архів КП' : 'Розрахунки та КП'}
        </Typography>
        {params.get('notice') === 'transferred' && (
          <Alert severity="success">
            КП передано. Список оновлено відповідно до вашого доступу.
          </Alert>
        )}
        {params.get('notice') === 'access-changed' && (
          <Alert severity="info">Доступ до КП змінився. Перевірте доступні КП у списку.</Alert>
        )}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button onClick={() => navigate('/crm/quotes/introductions')}>
            Добірки для знайомства
          </Button>
          <Button
            onClick={() => {
              const next = new URLSearchParams(params);
              next.delete('archived');
              next.delete('page');
              next.delete('notice');
              navigate({
                pathname: archived ? '/crm/quotes' : '/crm/quotes/archive',
                search: next.toString(),
              });
            }}
          >
            {archived ? 'Активні КП' : 'Архів КП'}
          </Button>
          <Button aria-expanded={advanced} onClick={() => setAdvanced(!advanced)}>
            Додаткові фільтри
          </Button>
        </Stack>
        {request.sourceQuoteId && (
          <Alert
            severity="info"
            action={
              <Button onClick={() => change('sourceQuoteId', '')}>Прибрати фільтр копій</Button>
            }
          >
            Показано копії вибраного КП.
          </Alert>
        )}
        {advanced && (
          <QuoteAdvancedFilters
            key={params.toString()}
            query={request}
            onApply={(values) => {
              const next = new URLSearchParams(params);
              for (const [key, value] of Object.entries(values)) {
                if (value) next.set(key, value);
                else next.delete(key);
              }
              next.delete('page');
              setParams(next);
            }}
          />
        )}
        <QuoteListFilters
          key={search}
          search={search}
          state={state ?? ''}
          canCreate={!!data && !query.error}
          onSearch={(value) => change('search', value)}
          onState={(value) => change('state', value)}
          onCreate={() => navigate('/crm/quotes/new')}
        />
        {(query.isLoading || (!data && query.isFetching)) && (
          <CircularProgress aria-label="Завантаження списку КП" />
        )}
        {query.error && (
          <Alert
            severity="error"
            action={<Button onClick={() => void query.refetch()}>Повторити</Button>}
          >
            {quoteError(query.error)}
          </Alert>
        )}
        {data && !query.error && (
          <>
            {!data.rows.length ? (
              <Alert severity="info">КП за цими умовами не знайдено.</Alert>
            ) : (
              <QuotesTable rows={data.rows} onOpen={(id) => navigate(`/crm/quotes/${id}`)} />
            )}
            <Pagination
              aria-label="Сторінки КП"
              page={page}
              count={Math.max(1, data.totalPages)}
              disabled={query.isFetching}
              onChange={(_, value) => change('page', String(value))}
            />
          </>
        )}
      </Stack>
    </Box>
  );
}
