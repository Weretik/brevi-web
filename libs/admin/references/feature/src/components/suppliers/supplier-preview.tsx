import { useListSuppliersQuery } from '@admin/references/data-access';
import { Alert, Snackbar } from '@mui/material';
import { useState } from 'react';

import { SupplierDrawer } from './supplier-drawer';

import type { Supplier } from '@admin/references/model';

/** A supplier named in a table or a card: by its ID when known, else by its name. */
export interface SupplierRef {
  id?: number | null;
  name?: string | null;
}

const same = (a: string, b: string) =>
  a.trim().toLocaleLowerCase('uk') === b.trim().toLocaleLowerCase('uk');

function find(suppliers: Supplier[], ref: SupplierRef) {
  if (ref.id != null) {
    const byId = suppliers.find((supplier) => supplier.id === ref.id);
    if (byId) return byId;
  }
  return ref.name ? suppliers.find((supplier) => same(supplier.name, ref.name ?? '')) : undefined;
}

/**
 * «Переглянути постачальника» from any table (CAT-019): the click on a supplier name opens the same card
 * as in «Контрагенти → Постачальники». `element` must be rendered once by the page.
 */
export function useSupplierPreview() {
  const [ref, setRef] = useState<SupplierRef | null>(null);
  const suppliers = useListSuppliersQuery(undefined, { skip: ref === null });
  const supplier = ref && suppliers.data ? find(suppliers.data, ref) : undefined;
  const missing = ref !== null && suppliers.isSuccess && !supplier;
  const failed = ref !== null && suppliers.isError;

  const element = (
    <>
      {supplier && (
        <SupplierDrawer
          key={supplier.id}
          mode="view"
          supplier={supplier}
          nextId={supplier.id}
          onClose={() => setRef(null)}
          onSaved={() => setRef(null)}
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
