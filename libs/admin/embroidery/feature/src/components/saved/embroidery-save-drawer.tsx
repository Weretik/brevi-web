import { useSaveEmbroideryCalculationMutation } from '@admin/embroidery/data-access';
import { EmbroiderySaveForm } from '@admin/embroidery/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';
import { useState } from 'react';

import { useEmbroideryCustomers } from '../../hooks/saved/use-embroidery-customers';

import type {
  EmbroideryCalculationRequest,
  EmbroideryPrice,
  EmbroiderySavedSummary,
} from '@admin/embroidery/model';
import type { EmbroiderySaveValues } from '@admin/embroidery/ui';

interface Props {
  request: EmbroideryCalculationRequest;
  /** The current prices; the person keeps one category. */
  prices: readonly EmbroideryPrice[];
  onClose: () => void;
  onSaved: (summary: EmbroiderySavedSummary) => void;
}

/**
 * «Зберегти розрахунок»: the server prices the same form again with the current rates and keeps only the chosen
 * category's price.
 */
export function EmbroiderySaveDrawer({ request, prices, onClose, onSaved }: Props) {
  const [values, setValues] = useState<EmbroiderySaveValues>({
    name: '',
    customer: null,
    category: prices[0]?.name ?? '',
  });
  const customers = useEmbroideryCustomers(true);
  const [save, state] = useSaveEmbroideryCalculationMutation();

  const submit = async () => {
    const result = await save({
      name: values.name,
      customerPublicId: values.customer?.publicId ?? null,
      calculation: request,
      category: values.category,
    });
    if ('data' in result && result.data) onSaved(result.data.summary);
  };

  return (
    <ReferenceEditorDrawer
      titleId="embroidery-save-title"
      title="Зберегти розрахунок"
      description="Збережеться ціна обраної категорії зі ставками, як зараз; пізніше вона не зміниться."
      formId="embroidery-save-form"
      paperWidth={440}
      readOnly={false}
      saving={state.isLoading}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={submit}
    >
      <Stack sx={{ gap: 2 }}>
        {state.isError && (
          <Alert severity="error">
            {(state.error as { message?: string } | undefined)?.message ??
              'Не вдалося зберегти розрахунок.'}
          </Alert>
        )}
        <EmbroiderySaveForm
          values={values}
          prices={prices}
          disabled={state.isLoading}
          customers={customers.options}
          onCustomerSearch={customers.search}
          onChange={setValues}
        />
      </Stack>
    </ReferenceEditorDrawer>
  );
}
