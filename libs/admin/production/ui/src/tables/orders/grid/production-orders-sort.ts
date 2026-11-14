import type { ProductionOrderSort } from '@admin/production/model';
import type { GridSortModel } from '@mui/x-data-grid';

const sortFields = { number: 'number', nearestDueDate: 'due', orderDate: 'created' } as const;
type SortField = keyof typeof sortFields;

/** The grid sort model of a server sort; an unknown sort shows no arrow. */
export function toSortModel(sort: ProductionOrderSort | undefined): GridSortModel {
  if (!sort) return [];
  const key = sort.replace('-', '');
  const field = (Object.keys(sortFields) as SortField[]).find((x) => sortFields[x] === key);
  return field ? [{ field, sort: sort.startsWith('-') ? 'desc' : 'asc' }] : [];
}

/** The server sort of a grid sort model; no column means newest numbers first. */
export function fromSortModel(model: GridSortModel): ProductionOrderSort {
  const first = model[0];
  if (!first || !(first.field in sortFields)) return '-number';
  const key = sortFields[first.field as SortField];
  return (first.sort === 'desc' ? `-${key}` : key) as ProductionOrderSort;
}
