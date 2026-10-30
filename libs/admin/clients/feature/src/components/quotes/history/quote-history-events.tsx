import { QuoteEventHistoryTable } from '@admin/clients/ui';
import { Alert, Button, CircularProgress, Pagination, Stack, Typography } from '@mui/material';

import { quoteError } from '../../../errors/quotes/quote-error';

import type { useQuoteHistory } from '../../../hooks/quotes/history/use-quote-history';

export function QuoteHistoryEvents({
  events,
  locked,
  change,
  eventPage,
}: Pick<ReturnType<typeof useQuoteHistory>, 'events' | 'locked' | 'change' | 'eventPage'>) {
  return (
    <Stack spacing={1}>
      <Typography component="h2" variant="h6">
        Дії та відповідальні
      </Typography>
      {events.isFetching && <CircularProgress size={24} aria-label="Завантаження дій" />}
      {events.error && (
        <Alert
          severity="error"
          action={<Button onClick={() => void events.refetch()}>Повторити дії</Button>}
        >
          {quoteError(events.error)}
        </Alert>
      )}
      {events.currentData && !events.error && (
        <>
          {!events.currentData.rows.length ? (
            <Alert severity="info">Дій на цій сторінці немає.</Alert>
          ) : (
            <QuoteEventHistoryTable rows={events.currentData.rows} />
          )}
          <Pagination
            aria-label="Сторінки дій"
            page={eventPage}
            count={Math.max(1, events.currentData.totalPages)}
            disabled={locked || events.isFetching}
            onChange={(_event, page) => change('eventPage', String(page))}
          />
        </>
      )}
    </Stack>
  );
}
