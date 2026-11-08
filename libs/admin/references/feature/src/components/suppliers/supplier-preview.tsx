import { useListSuppliersQuery } from '@admin/references/data-access';
import { SupplierViewPanel } from '@admin/references/ui';
import { Alert, Snackbar } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Supplier } from '@admin/references/model';
import type { SupplierViewRelatedRow } from '@admin/references/ui';

/** A supplier named in a table or a card: by its ID when known, else by its name. */
export interface SupplierRef {
  id?: number | null;
  name?: string | null;
  /** An extra section of the card, for example the fabrics of this supplier in the current КП. */
  related?: { title: string; rows: readonly SupplierViewRelatedRow[] };
}

export interface SupplierPreviewOptions {
  /** Whether the user may open «Контрагенти»; false hides «Відкрити в контрагентах». */
  canOpenCounterparties?: boolean;
}

/** «Відкрити в контрагентах»: the suppliers tab opens this supplier's card. */
export const counterpartiesSupplierPath = (id: number) =>
  `/references/counterparties?supplier=${id}`;

const same = (a: string, b: string) =>
  a.trim().toLocaleLowerCase('uk') === b.trim().toLocaleLowerCase('uk');

function find(suppliers: Supplier[], ref: SupplierRef) {
  if (ref.id != null) {
    const byId = suppliers.find((supplier) => supplier.id === ref.id);
    if (byId) return byId;
  }
  return ref.name ? suppliers.find((supplier) => same(supplier.name, ref.name ?? '')) : undefined;
}

/** The open card; it needs the router only while it is shown. */
function SupplierPreviewPanel({
  supplier,
  related,
  canOpenCounterparties,
  onClose,
}: {
  supplier: Supplier;
  related: SupplierRef['related'];
  canOpenCounterparties: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  return (
    <SupplierViewPanel
      supplier={supplier}
      related={related}
      onOpenInCounterparties={
        canOpenCounterparties
          ? () => {
              onClose();
              void navigate(counterpartiesSupplierPath(supplier.id));
            }
          : undefined
      }
      onClose={onClose}
    />
  );
}

/**
 * «Переглянути постачальника» from any table (CAT-019): the click on a supplier name opens the supplier's
 * read-only card with «Відкрити в контрагентах». `element` must be rendered once by the page.
 */
export function useSupplierPreview({ canOpenCounterparties = true }: SupplierPreviewOptions = {}) {
  const [ref, setRef] = useState<SupplierRef | null>(null);
  const suppliers = useListSuppliersQuery(undefined, { skip: ref === null });
  const supplier = ref && suppliers.data ? find(suppliers.data, ref) : undefined;
  const missing = ref !== null && suppliers.isSuccess && !supplier;
  const failed = ref !== null && suppliers.isError;

  const element = (
    <>
      {supplier && (
        <SupplierPreviewPanel
          key={supplier.id}
          supplier={supplier}
          related={ref?.related}
          canOpenCounterparties={canOpenCounterparties}
          onClose={() => setRef(null)}
        />
      )}
      <Snackbar
        open={missing || failed}
        autoHideDuration={5000}
        onClose={() => setRef(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="warning" onClose={() => setRef(null)}>
          {failed
            ? 'Не вдалося завантажити постачальників.'
            : `Постачальника «${ref?.name ?? ''}» немає в «Контрагенти → Постачальники».`}
        </Alert>
      </Snackbar>
    </>
  );

  return { open: (next: SupplierRef) => setRef(next), element };
}
