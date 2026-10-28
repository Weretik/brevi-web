import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import type { QuoteSummary } from '@admin/clients/model';

export function QuotesTable({
  rows,
  onOpen,
}: {
  rows: readonly QuoteSummary[];
  onOpen: (id: string) => void;
}) {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table aria-label="Список КП">
        <TableHead>
          <TableRow>
            <TableCell>Одержувач</TableCell>
            <TableCell>Стан</TableCell>
            <TableCell>Версія</TableCell>
            <TableCell>Номер</TableCell>
            <TableCell>Дія</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.publicId}>
              <TableCell>{row.recipientName}</TableCell>
              <TableCell>
                {row.state === 'draft'
                  ? 'Чернетка'
                  : row.state === 'ready'
                    ? 'Готове'
                    : 'Надіслане'}
              </TableCell>
              <TableCell>{row.versionNumber}</TableCell>
              <TableCell>{row.number ?? '—'}</TableCell>
              <TableCell>
                <Button onClick={() => onOpen(row.publicId)}>Відкрити КП</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
