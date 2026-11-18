import { QuoteCustomRows } from '@admin/quotes/ui';
import { Typography } from '@mui/material';

import type { useQuoteCustomSewing } from '../../hooks/custom-sewing/use-quote-custom-sewing';
import type { QuoteCustomLineDraft } from '@admin/quotes/model';

interface Props {
  panel: ReturnType<typeof useQuoteCustomSewing>;
}

const rowsOf = (
  lines: readonly QuoteCustomLineDraft[],
  kind: 'Fabric' | 'Service',
  label: string,
) =>
  lines
    .filter((x) => x.kind === kind)
    .map((x) => ({ key: x.key, name: x.name, quantity: x.quantity, quantityLabel: label }));

/** «Спільне для всіх варіантів»: extra fabrics, accessories, services and operations. */
export function QuoteCustomSharedLines({ panel }: Props) {
  const { draft } = panel;
  const extraFabrics = rowsOf(draft.lines, 'Fabric', 'Метрів');
  const services = rowsOf(draft.lines, 'Service', 'Разів');
  return (
    <>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Спільне для всіх варіантів
      </Typography>
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
    </>
  );
}
