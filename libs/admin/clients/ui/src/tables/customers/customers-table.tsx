import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';

import type { CustomerPage } from '@admin/clients/model';

export interface CustomersTableProps {
  data: CustomerPage;
  onOpen: (id: string) => void;
  onPage: (page: number) => void;
}
export function CustomersTable({ data, onOpen, onPage }: CustomersTableProps) {
  return (
    <>
      <Table aria-label="Клієнти">
        <TableHead>
          <TableRow>
            <TableCell>Клієнт</TableCell>
            <TableCell>Тип</TableCell>
            <TableCell>ЄДРПОУ / ІПН</TableCell>
            <TableCell>Стан</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.rows.map((row) => (
            <TableRow key={row.publicId}>
              <TableCell>
                <Button onClick={() => onOpen(row.publicId)}>{row.displayName}</Button>
              </TableCell>
              <TableCell>{row.kind === 'organization' ? 'Організація' : 'Особа'}</TableCell>
              <TableCell>{row.taxIdentity ?? '—'}</TableCell>
              <TableCell>{row.active ? 'Активний' : 'Неактивний'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={data.total}
        page={data.page - 1}
        rowsPerPage={data.pageSize}
        rowsPerPageOptions={[data.pageSize]}
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} із ${count}`}
        onPageChange={(_, page) => onPage(page + 1)}
      />
    </>
  );
}
