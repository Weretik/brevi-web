import { useSupplierPreview } from '@admin/references/feature';

import type { QuoteSupplierCard } from '@admin/quotes/feature';

/** The КП editor opens a fabric's supplier in the read-only card of «Контрагенти» (R-32). */
export function useQuoteSupplierCard(): QuoteSupplierCard {
  const preview = useSupplierPreview();
  return {
    open: (target) =>
      preview.open({
        id: target.id,
        name: target.name,
        related: {
          title: 'Тканини цього постачальника в КП',
          rows: target.fabrics.map((fabric) => ({
            key: fabric.fabricId,
            label: fabric.name,
            value: fabric.pricePerMeter,
          })),
        },
      }),
    element: preview.element,
  };
}
