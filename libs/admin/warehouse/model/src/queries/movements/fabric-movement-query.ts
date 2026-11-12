import { fabricMovementFilters } from '../../entities/movements/fabric-movement';

import type { FabricMovementFilter } from '../../entities/movements/fabric-movement';

/** What «Рух тканини» lists: one page of the filter, newest operation date first. */
export interface FabricMovementQuery {
  page: number;
  kind: FabricMovementFilter;
  fabricCode: string | null;
  color: string | null;
  itemId: number | null;
}

export const defaultFabricMovementQuery: FabricMovementQuery = {
  page: 1,
  kind: 'All',
  fabricCode: null,
  color: null,
  itemId: null,
};

/** Changing a filter starts again from the first page. */
export const withMovementFilter = (
  query: FabricMovementQuery,
  change: Partial<Omit<FabricMovementQuery, 'page'>>,
): FabricMovementQuery => ({ ...query, ...change, page: 1 });

/** The kind filter of an address (`?kind=Opening` from the old «Початкові залишки»); anything else lists all. */
export const movementFilterOf = (value: string | null): FabricMovementFilter =>
  fabricMovementFilters.find((kind) => kind === value) ?? 'All';
