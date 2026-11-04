import { useGetQuoteHistoryQuery } from '@admin/quotes/data-access';
import { QuoteHistoryList } from '@admin/quotes/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Box, CircularProgress } from '@mui/material';

interface Props {
  quoteId: number;
  number: string;
  onClose: () => void;
}

/** «Історія змін» of a КП in the side panel; read fresh every time it opens. */
export function QuoteHistoryDrawer({ quoteId, number, onClose }: Props) {
  const history = useGetQuoteHistoryQuery(quoteId, { refetchOnMountOrArgChange: true });
  return (
    <ReferenceEditorDrawer
      titleId="quote-history-title"
      title="Історія змін"
      description={`КП ${number}: хто і коли його змінював.`}
      formId="quote-history-form"
      paperWidth={440}
      readOnly
      editLabel={null}
      saving={false}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => undefined}
    >
      {history.isError && <Alert severity="error">Не вдалося завантажити історію.</Alert>}
      {history.isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress aria-label="Завантаження історії" />
        </Box>
      )}
      {history.data && <QuoteHistoryList events={history.data} />}
    </ReferenceEditorDrawer>
  );
}
