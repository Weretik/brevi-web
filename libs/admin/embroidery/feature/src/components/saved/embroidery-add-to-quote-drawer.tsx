import { EmbroideryAddToQuoteForm } from '@admin/embroidery/ui';
import { useAddQuoteEmbroideryMutation } from '@admin/quotes/data-access';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';
import { useState } from 'react';

import { useEmbroideryQuotes } from '../../hooks/saved/use-embroidery-quotes';

import type { EmbroiderySavedSummary } from '@admin/embroidery/model';
import type { EmbroideryAddToQuoteValues } from '@admin/embroidery/ui';

interface Props {
  summary: EmbroiderySavedSummary;
  onClose: () => void;
  onAdded: (quote: { id: number; number: string }) => void;
}

/** «Додати в КП»: one row with the saved price category in all three columns of the КП. */
export function EmbroideryAddToQuoteDrawer({ summary, onClose, onAdded }: Props) {
  const [values, setValues] = useState<EmbroideryAddToQuoteValues>({ quote: null });
  const [tried, setTried] = useState(false);
  const quotes = useEmbroideryQuotes();
  const [add, state] = useAddQuoteEmbroideryMutation();

  const submit = async () => {
    setTried(true);
    if (!values.quote || !summary.price) return;
    const result = await add({
      id: values.quote.id,
      calculationId: summary.id,
    });
    if ('data' in result && result.data)
      onAdded({ id: result.data.id, number: result.data.number });
  };

  return (
    <ReferenceEditorDrawer
      titleId="embroidery-add-to-quote-title"
      title={`Додати ${summary.number} в КП`}
      description="Вишивка стане окремим рядком у кінці КП; ціна не зміниться, навіть якщо ставки змінять."
      formId="embroidery-add-to-quote-form"
      paperWidth={440}
      readOnly={false}
      saving={state.isLoading}
      submitLabel="Додати"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={submit}
    >
      <Stack sx={{ gap: 2 }}>
        {state.isError && (
          <Alert severity="error">
            {(state.error as { message?: string } | undefined)?.message ??
              'Не вдалося додати вишивку в КП.'}
          </Alert>
        )}
        {tried && !values.quote && <Alert severity="warning">Оберіть КП.</Alert>}
        <EmbroideryAddToQuoteForm
          values={values}
          price={summary.price}
          quotes={quotes.options}
          loadingQuotes={quotes.loading}
          disabled={state.isLoading}
          onQuoteSearch={quotes.search}
          onChange={setValues}
        />
      </Stack>
    </ReferenceEditorDrawer>
  );
}
