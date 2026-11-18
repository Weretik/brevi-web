import { QuoteCustomPriceSummary } from '@admin/quotes/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Divider, Stack, TextField } from '@mui/material';

import { QuoteCustomSharedLines } from './quote-custom-shared-lines';
import { QuoteCustomVariantsSection } from './quote-custom-variants-section';
import { useQuoteCustomSewing } from '../../hooks/custom-sewing/use-quote-custom-sewing';

import type { QuoteItemDraft, QuoteModelComposition } from '@admin/quotes/model';

interface Props {
  /** The item to change; a new «Виріб з нуля» without it. */
  item?: QuoteItemDraft;
  /** «Змінити склад» of a Catalog model: its Catalog composition to start from. */
  model?: QuoteModelComposition;
  onClose: () => void;
  onDone: (item: QuoteItemDraft) => void;
}

/**
 * «Виріб з нуля»: a product that is not in the Catalog. Each variant is its own set of fabrics; accessories, services
 * and operations are shared. Every variant is priced by the Catalog formula; nothing is added to the Catalog.
 */
export function QuoteCustomSewingDrawer({ item, model, onClose, onDone }: Props) {
  const panel = useQuoteCustomSewing(item, model);
  const { draft } = panel;
  const changingModel =
    model !== undefined || (item?.kind === 'CustomSewing' && item.productId !== null);
  return (
    <ReferenceEditorDrawer
      titleId="quote-custom-sewing-title"
      title={changingModel ? 'Змінити склад моделі' : item ? 'Склад виробу з нуля' : 'Виріб з нуля'}
      description={
        changingModel
          ? 'Склад моделі з каталогу: змініть варіанти тканин, фурнітуру чи операції. Ціну рахує система за формулою каталогу; модель у каталозі не змінюється.'
          : 'Кожен варіант — свій набір тканин (їх вартість додається). Фурнітура й операції спільні для всіх варіантів. Ціну рахує система за формулою каталогу.'
      }
      formId="quote-custom-sewing-form"
      paperWidth={720}
      readOnly={false}
      saving={false}
      saveDisabled={!panel.canAdd}
      submitLabel={item?.kind === 'CustomSewing' || model ? 'Зберегти склад' : 'Додати в КП'}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => {
        if (panel.canAdd) onDone(panel.build());
      }}
    >
      <Stack sx={{ gap: 2 }}>
        {panel.referencesError && (
          <Alert severity="error">Не вдалося завантажити довідники. Оновіть сторінку.</Alert>
        )}
        <TextField
          required
          size="small"
          label="Назва виробу"
          value={draft.name}
          onChange={(event) => panel.change({ name: event.target.value })}
          slotProps={{ htmlInput: { maxLength: 200 } }}
        />
        <TextField
          multiline
          minRows={2}
          size="small"
          label="Опис для клієнта"
          value={draft.description}
          onChange={(event) => panel.change({ description: event.target.value })}
          slotProps={{ htmlInput: { maxLength: 4000 } }}
        />
        <Divider />
        <QuoteCustomVariantsSection panel={panel} />
        <Divider />
        <QuoteCustomSharedLines panel={panel} />
        <QuoteCustomPriceSummary
          calculating={panel.calculating}
          missing={panel.missing}
          error={panel.error}
        />
      </Stack>
    </ReferenceEditorDrawer>
  );
}
