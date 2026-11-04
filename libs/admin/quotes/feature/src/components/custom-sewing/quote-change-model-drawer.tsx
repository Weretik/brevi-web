import { useGetQuoteModelCompositionQuery } from '@admin/quotes/data-access';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Box, CircularProgress } from '@mui/material';

import { QuoteCustomSewingDrawer } from './quote-custom-sewing-drawer';

import type { QuoteItemDraft } from '@admin/quotes/model';

interface Props {
  /** A Catalog sewing model of the КП. */
  item: QuoteItemDraft;
  onClose: () => void;
  onDone: (item: QuoteItemDraft) => void;
}

/** «Змінити склад» of a Catalog model: loads its Catalog composition, then opens the composition panel. */
export function QuoteChangeModelDrawer({ item, onClose, onDone }: Props) {
  const composition = useGetQuoteModelCompositionQuery(item.productId ?? 0, {
    skip: item.productId === null,
    refetchOnMountOrArgChange: true,
  });
  if (composition.data)
    return (
      <QuoteCustomSewingDrawer
        item={item}
        model={composition.data}
        onClose={onClose}
        onDone={onDone}
      />
    );
  return (
    <ReferenceEditorDrawer
      titleId="quote-change-model-title"
      title="Змінити склад моделі"
      description={item.name}
      formId="quote-change-model-form"
      paperWidth={720}
      readOnly={false}
      saving={false}
      saveDisabled
      submitLabel="Зберегти склад"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => undefined}
    >
      {composition.isError ? (
        <Alert severity="error">Не вдалося завантажити склад моделі з каталогу.</Alert>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress aria-label="Завантаження складу моделі" />
        </Box>
      )}
    </ReferenceEditorDrawer>
  );
}
