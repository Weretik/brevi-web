import { createContext, useContext } from 'react';

import type { ReactNode } from 'react';

/** A supplier named on a page: by its ID when known, else by its name. */
export interface SupplierCardTarget {
  readonly id?: number | null;
  readonly name?: string | null;
}

type OpenSupplierCard = (target: SupplierCardTarget) => void;

const SupplierCardContext = createContext<OpenSupplierCard | null>(null);

/**
 * The app gives every page one way to open a supplier (CARD-001): the read-only supplier panel with
 * «Відкрити картку». Pages without the provider (tests, the public site) show plain names.
 */
export function SupplierCardProvider({
  open,
  children,
}: {
  open: OpenSupplierCard;
  children: ReactNode;
}) {
  return <SupplierCardContext.Provider value={open}>{children}</SupplierCardContext.Provider>;
}

/** Opens the supplier panel, or null where the app gave none. */
export function useOpenSupplierCard(): OpenSupplierCard | null {
  return useContext(SupplierCardContext);
}
