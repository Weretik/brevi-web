import { QuoteCustomPriceSummary, QuoteCustomRows } from '@admin/quotes/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Divider, Stack, TextField } from '@mui/material';

import { useQuoteCustomSewing } from '../../hooks/custom-sewing/use-quote-custom-sewing';

import type { QuoteItemDraft } from '@admin/quotes/model';

interface Props {
  /** The item to change; a new «Виріб з нуля» without it. */
  item?: QuoteItemDraft;
  onClose: () => void;
  onDone: (item: QuoteItemDraft) => void;
}

/**
 * «Виріб з нуля»: a product that is not in the Catalog, composed from fabrics, accessories and operations and
 * priced by the same formula as the Catalog. Nothing is added to the Catalog.
 */
export function QuoteCustomSewingDrawer({ item, onClose, onDone }: Props) {
  const panel = useQuoteCustomSewing(item);
  const { draft } = panel;
  return (
    <ReferenceEditorDrawer
      titleId="quote-custom-sewing-title"
      title={item ? 'Склад виробу з нуля' : 'Виріб з нуля'}
      description="Тканини, фурнітура й операції з довідників. Ціну рахує система за формулою каталогу; в каталог виріб не потрапляє."
      formId="quote-custom-sewing-form"
      paperWidth={720}
      readOnly={false}
      saving={false}
      saveDisabled={!panel.canAdd}
      submitLabel={item ? 'Зберегти склад' : 'Додати в КП'}
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
        <QuoteCustomRows
          title="Тканини"
          rows={draft.fabrics.map((x) => ({
            key: x.key,
            name: x.name,
            quantity: x.meters,
            quantityLabel: 'Метрів',
          }))}
          choices={panel.choices.fabrics}
          addLabel="Додати тканину"
          loading={panel.loadingReferences}
          onAdd={panel.addFabric}
          onQuantity={panel.setMeters}
          onRemove={panel.removeFabric}
        />
        <QuoteCustomRows
          title="Фурнітура"
          rows={draft.lines
            .filter((x) => x.kind === 'Accessory')
            .map((x) => ({
              key: x.key,
              name: x.name,
              quantity: x.quantity,
              quantityLabel: x.unit,
            }))}
          choices={panel.choices.accessories}
          addLabel="Додати фурнітуру"
          loading={panel.loadingReferences}
          onAdd={panel.addAccessory}
          onQuantity={(key, quantity) => panel.setLine(key, { quantity })}
          onRemove={panel.removeLine}
        />
        <QuoteCustomRows
          title="Операції"
          rows={draft.lines
            .filter((x) => x.kind === 'Operation')
            .map((x) => ({
              key: x.key,
              name: x.name,
              quantity: x.quantity,
              quantityLabel: 'Разів',
              minutes: x.needsMinutes ? x.minutes : undefined,
            }))}
          choices={panel.choices.operations}
          addLabel="Додати операцію"
          loading={panel.loadingReferences}
          onAdd={panel.addOperation}
          onQuantity={(key, quantity) => panel.setLine(key, { quantity })}
          onMinutes={(key, minutes) => panel.setLine(key, { minutes })}
          onRemove={panel.removeLine}
        />
        <Divider />
        <QuoteCustomPriceSummary
          price={panel.price}
          calculating={panel.calculating}
          missing={panel.missing}
          error={panel.error}
        />
      </Stack>
    </ReferenceEditorDrawer>
  );
}
