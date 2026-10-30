import { useGetQuoteQuery } from '@admin/clients/data-access';
import { Alert, Box, Button, CircularProgress, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';

import { QuoteEditorForm } from '../../../components/quotes/editor/quote-editor-form';
import { quoteError } from '../../../errors/quotes/quote-error';

export default function QuoteEditorPage() {
  const { quoteId } = useParams<{ quoteId: string }>();
  const query = useGetQuoteQuery(quoteId ?? '', {
    skip: !quoteId,
    refetchOnMountOrArgChange: true,
  });
  const detail = query.currentData;
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Stack spacing={2}>
        {quoteId && (query.isLoading || (!detail && query.isFetching)) && (
          <CircularProgress aria-label="Завантаження КП" />
        )}
        {query.error && (
          <Alert
            severity="error"
            action={<Button onClick={() => void query.refetch()}>Повторити</Button>}
          >
            {quoteError(query.error)}
          </Alert>
        )}
        {!quoteId && <QuoteEditorForm key="new" initial={null} />}
        {quoteId && detail && !query.error && (
          <QuoteEditorForm
            key={quoteId}
            initial={detail}
            accessError={!!query.error}
            reload={() => query.refetch().unwrap()}
          />
        )}
      </Stack>
    </Box>
  );
}
