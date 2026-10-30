import { QuoteVersionHistoryTable } from '@admin/clients/ui';
import { Alert, Button, CircularProgress, Pagination, Stack, Typography } from '@mui/material';

import { quoteError } from '../../../errors/quotes/quote-error';

import type { useQuoteHistory } from '../../../hooks/quotes/history/use-quote-history';

export function QuoteHistoryVersions({
  versions,
  versionId,
  locked,
  change,
  versionPage,
}: Pick<
  ReturnType<typeof useQuoteHistory>,
  'versions' | 'versionId' | 'locked' | 'change' | 'versionPage'
>) {
  return (
    <Stack spacing={1}>
      <Typography component="h2" variant="h6">
        Версії
      </Typography>
      {versions.isFetching && <CircularProgress size={24} aria-label="Завантаження версій" />}
      {versions.error && (
        <Alert
          severity="error"
          action={<Button onClick={() => void versions.refetch()}>Повторити версії</Button>}
        >
          {quoteError(versions.error)}
        </Alert>
      )}
      {versions.currentData && !versions.error && (
        <>
          {!versions.currentData.rows.length ? (
            <Alert severity="info">Версій на цій сторінці немає.</Alert>
          ) : (
            <QuoteVersionHistoryTable
              rows={versions.currentData.rows}
              selectedId={versionId}
              disabled={locked}
              onSelect={(id) => change('version', id)}
            />
          )}
          <Pagination
            aria-label="Сторінки версій"
            page={versionPage}
            count={Math.max(1, versions.currentData.totalPages)}
            disabled={locked || versions.isFetching}
            onChange={(_event, page) => change('versionPage', String(page))}
          />
        </>
      )}
    </Stack>
  );
}
