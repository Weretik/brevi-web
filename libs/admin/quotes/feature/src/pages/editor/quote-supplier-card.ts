import type { QuoteSupplierFabric } from '@admin/quotes/model';
import type { ReactNode } from 'react';

/** The supplier of a fabric in the КП and the КП fabrics bought from it. */
export interface QuoteSupplierCardTarget {
  id: number | null;
  name: string;
  fabrics: readonly QuoteSupplierFabric[];
}

/** The supplier card of the КП editor (R-32): `open` is null when the app gives none. */
export interface QuoteSupplierCard {
  open: ((target: QuoteSupplierCardTarget) => void) | null;
  /** Rendered once by the page. */
  element: ReactNode;
}
