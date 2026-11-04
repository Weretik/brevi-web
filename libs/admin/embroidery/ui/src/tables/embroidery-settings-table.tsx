import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { ReactNode } from 'react';

export interface EmbroiderySettingsColumn<Row> {
  title: string;
  numeric?: boolean;
  cell: (row: Row) => ReactNode;
}

interface Props<Row extends { id: string }> {
  id: string;
  title: string;
  addLabel: string;
  rows: readonly Row[];
  columns: readonly EmbroiderySettingsColumn<Row>[];
  /** The list's own problem, e.g. «Потрібно від 1 до 30 п’ялець». */
  error?: string;
  /** Row ids with problems; they get «Виправте» in red. */
  rowsWithErrors: ReadonlySet<string>;
  onOpen: (row: Row) => void;
  onAdd: () => void;
}

const numeric = {
  textAlign: 'right',
  fontFamily: 'var(--admin-font-mono)',
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
} as const;

/** A short list of «Налаштування» in a data card; a row click opens the side panel. */
export function EmbroiderySettingsTable<Row extends { id: string }>({
  id,
  title,
  addLabel,
  rows,
  columns,
  error,
  rowsWithErrors,
  onOpen,
  onAdd,
}: Props<Row>) {
  return (
    <Paper
      variant="outlined"
      component="section"
      id={id}
      aria-label={title}
      sx={{ scrollMarginTop: 88 }}
    >
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'center', px: 2, pt: 1.5, pb: 1 }}
      >
        <Typography component="h2" variant="h6">
          {title}
        </Typography>
        <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={onAdd}>
          {addLabel}
        </Button>
      </Stack>
      {error && (
        <Typography variant="body2" color="error" sx={{ px: 2, pb: 1 }}>
          {error}
        </Typography>
      )}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.title}
                  sx={column.numeric ? { textAlign: 'right' } : undefined}
                >
                  {column.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                hover
                tabIndex={0}
                sx={{ cursor: 'pointer' }}
                onClick={() => onOpen(row)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onOpen(row);
                  }
                }}
              >
                {columns.map((column, index) => (
                  <TableCell key={column.title} sx={column.numeric ? numeric : undefined}>
                    {column.cell(row)}
                    {index === 0 && rowsWithErrors.has(row.id) && (
                      <Typography component="span" variant="caption" color="error">
                        {' · Виправте'}
                      </Typography>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
