import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { ReactNode } from 'react';

const mono = { fontFamily: 'var(--admin-font-mono)', whiteSpace: 'nowrap' } as const;

export interface ReportColumn<Row> {
  label: string;
  numeric?: boolean;
  cell: (row: Row) => ReactNode;
}

/** One table of «Звіти цеху»: numbers right-aligned in mono, a sentence instead of an empty table. */
export function ReportTable<Row>({
  label,
  empty,
  rows,
  rowKey,
  columns,
}: {
  label: string;
  empty: string;
  rows: Row[];
  rowKey: (row: Row) => number;
  columns: ReportColumn<Row>[];
}) {
  if (rows.length === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        {empty}
      </Typography>
    );
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label={label}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.label} align={column.numeric ? 'right' : 'left'}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={rowKey(row)}>
              {columns.map((column) => (
                <TableCell
                  key={column.label}
                  align={column.numeric ? 'right' : 'left'}
                  sx={column.numeric ? mono : undefined}
                >
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
