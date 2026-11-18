import { ReferenceFilterChip, ReferenceFilterRow } from '@admin/references/ui';

import type { usePurchaseInvoiceList } from '../../hooks/invoices/use-purchase-invoice-list';

interface Props {
  state: ReturnType<typeof usePurchaseInvoiceList>;
  total: number;
}

/** «Усі», «Помилки і перевірка», «Без постачальника», «Не розпізнані» with their counts. */
export function PurchaseInvoiceFilters({ state, total }: Props) {
  return (
    <ReferenceFilterRow
      filters={
        <>
          <ReferenceFilterChip
            label="Усі"
            count={state.counts.All}
            selected={state.filter === 'All'}
            onClick={() => state.setFilter('All')}
          />
          <ReferenceFilterChip
            label="Помилки і перевірка"
            count={state.counts.NeedsReview}
            selected={state.filter === 'NeedsReview'}
            onClick={() => state.setFilter('NeedsReview')}
          />
          <ReferenceFilterChip
            label="Без постачальника"
            count={state.counts.WithoutSupplier}
            selected={state.filter === 'WithoutSupplier'}
            onClick={() => state.setFilter('WithoutSupplier')}
          />
          <ReferenceFilterChip
            label="Не розпізнані"
            count={state.counts.NotRecognized}
            selected={state.filter === 'NotRecognized'}
            onClick={() => state.setFilter('NotRecognized')}
          />
        </>
      }
      count={total}
      total={state.counts[state.filter]}
      countLabel="Кількість рахунків"
      selectedCount={0}
      onClearSelection={() => undefined}
    />
  );
}
