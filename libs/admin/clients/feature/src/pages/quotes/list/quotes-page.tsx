import { useListQuotesQuery } from '@admin/clients/data-access';
import { QuotesTable } from '@admin/clients/ui';
import { Alert, Box, Button, CircularProgress, Pagination, Stack, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { QuoteListFilters } from '../../../components/quotes/list/quote-list-filters';
import { quoteError } from '../../../errors/quotes/quote-error';

export default function QuotesPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const search = (params.get('search') ?? '').slice(0, 300);
  const pageNumber = Number(params.get('page') ?? 1);
  const page =
    Number.isInteger(pageNumber) && pageNumber >= 1 && pageNumber <= 1000000 ? pageNumber : 1;
  const filter = params.get('state');
  const state = filter === 'draft' || filter === 'ready' || filter === 'sent' ? filter : undefined;
  const archived = params.get('archived') === 'true';
  const query = useListQuotesQuery({ search, state, archived, page, pageSize: 25 });
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
          Розрахунки та КП
        </Typography>
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
