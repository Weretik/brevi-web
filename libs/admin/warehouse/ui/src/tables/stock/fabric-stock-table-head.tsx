import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';

import type { StockSortKey } from '@admin/warehouse/model';

const columns: [StockSortKey, string][] = [
  ['meters', 'Залишок, м'],
  ['booked', 'У броні'],
  ['free', 'Вільно'],
];

/** The sortable header of «Залишки»: name, metres, booked, free, and the last operation. */
export function FabricStockTableHead({
  sort,
  onSort,
}: {
  sort: { key: StockSortKey; descending: boolean };
  onSort: (key: StockSortKey) => void;
}) {
  return (
    <TableHead sx={{ '& th': { bgcolor: 'background.paper' } }}>
      <TableRow>
        <TableCell sortDirection={sort.key === 'name' ? (sort.descending ? 'desc' : 'asc') : false}>
          <TableSortLabel
            active={sort.key === 'name'}
            direction={sort.key === 'name' && sort.descending ? 'desc' : 'asc'}
            onClick={() => onSort('name')}
          >
            Тканина / колір
          </TableSortLabel>
        </TableCell>
        {columns.map(([key, label]) => (
          <TableCell
            key={key}
            align="right"
            sortDirection={sort.key === key ? (sort.descending ? 'desc' : 'asc') : false}
            sx={{ width: 120 }}
          >
            <TableSortLabel
              active={sort.key === key}
              direction={sort.key === key && !sort.descending ? 'asc' : 'desc'}
              onClick={() => onSort(key)}
            >
              {label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell sx={{ width: 200 }}>Остання операція</TableCell>
      </TableRow>
    </TableHead>
  );
}
