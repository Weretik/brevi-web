import { useRepriceQuoteMutation } from '@admin/quotes/data-access';
import { QuoteRepriceReportView } from '@admin/quotes/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

import type { Quote, QuoteRepriceReport } from '@admin/quotes/model';

interface Props {
  quote: Quote;
  onClose: () => void;
  /** After applying: the editor reloads the КП with the new prices. */
  onApplied: () => void;
}

/** «Перерахувати за актуальними цінами»: first shows old → new, saves only on «Застосувати». */
export function QuoteRepriceDrawer({ quote, onClose, onApplied }: Props) {
  const [reprice, repricing] = useRepriceQuoteMutation();
  const [report, setReport] = useState<QuoteRepriceReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    reprice({ id: quote.id, version: quote.version, apply: false })
      .unwrap()
      .then(setReport)
      .catch((cause: { message?: string }) =>
        setError(cause.message ?? 'Не вдалося перевірити ціни.'),
      );
  }, [reprice, quote.id, quote.version]);

  return (
    <ReferenceEditorDrawer
      titleId="quote-reprice-title"
      title="Перерахувати за актуальними цінами"
      description="Ціни каталогу на сьогодні. Ручні ціни ЗІЗ не змінюються."
      formId="quote-reprice-form"
      paperWidth={720}
      readOnly={false}
      saving={repricing.isLoading}
      saveDisabled={!report || report.changes.length === 0}
      submitLabel="Застосувати"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={async () => {
        setError(null);
        try {
          await reprice({ id: quote.id, version: quote.version, apply: true }).unwrap();
          onApplied();
        } catch (cause) {
          setError((cause as { message?: string }).message ?? 'Не вдалося оновити ціни.');
        }
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {report ? (
        <QuoteRepriceReportView report={report} />
      ) : (
        !error && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={28} aria-label="Перевіряємо ціни" />
          </Box>
        )
      )}
    </ReferenceEditorDrawer>
  );
}
