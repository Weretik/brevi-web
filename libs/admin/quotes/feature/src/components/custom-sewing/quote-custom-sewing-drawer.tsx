import { QuoteCustomPriceSummary, QuoteCustomRows } from '@admin/quotes/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Divider, Stack, TextField } from '@mui/material';

import { useQuoteCustomSewing } from '../../hooks/custom-sewing/use-quote-custom-sewing';

import type {
  QuoteCustomLineDraft,
  QuoteItemDraft,
  QuoteModelComposition,
} from '@admin/quotes/model';

interface Props {
  /** The item to change; a new «Виріб з нуля» without it. */
  item?: QuoteItemDraft;
  /** «Змінити склад» of a Catalog model: its Catalog composition to start from. */
  model?: QuoteModelComposition;
  onClose: () => void;
  onDone: (item: QuoteItemDraft) => void;
}

/**
 * «Виріб з нуля»: a product that is not in the Catalog, composed from fabrics, accessories and operations and
 * priced by the same formula as the Catalog. Nothing is added to the Catalog.
 */
const rowsOf = (
  lines: readonly QuoteCustomLineDraft[],
  kind: 'Fabric' | 'Service',
  label: string,
) =>
  lines
    .filter((x) => x.kind === kind)
    .map((x) => ({ key: x.key, name: x.name, quantity: x.quantity, quantityLabel: label }));

export function QuoteCustomSewingDrawer({ item, model, onClose, onDone }: Props) {
  const panel = useQuoteCustomSewing(item, model);
  const { draft } = panel;
  const changingModel =
    model !== undefined || (item?.kind === 'CustomSewing' && item.productId !== null);
  const extraFabrics = rowsOf(draft.lines, 'Fabric', 'Метрів');
  const services = rowsOf(draft.lines, 'Service', 'Разів');
  return (
    <ReferenceEditorDrawer
      titleId="quote-custom-sewing-title"
      title={changingModel ? 'Змінити склад моделі' : item ? 'Склад виробу з нуля' : 'Виріб з нуля'}
      description={
        changingModel
          ? 'Склад моделі з каталогу: змініть тканини, фурнітуру чи операції. Ціну рахує система за формулою каталогу; модель у каталозі не змінюється.'
          : 'Тканини, фурнітура й операції з довідників. Ціну рахує система за формулою каталогу; в каталог виріб не потрапляє.'
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
        {extraFabrics.length > 0 && (
          <QuoteCustomRows
            title="Додаткові тканини"
            rows={extraFabrics}
            onQuantity={(key, quantity) => panel.setLine(key, { quantity })}
            onRemove={panel.removeLine}
          />
        )}
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
        {services.length > 0 && (
          <QuoteCustomRows
            title="Послуги"
            rows={services}
            onQuantity={(key, quantity) => panel.setLine(key, { quantity })}
            onRemove={panel.removeLine}
          />
        )}
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
