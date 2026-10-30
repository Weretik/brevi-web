import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import {
  quoteHistoryAction,
  quoteHistoryDate,
} from '../../components/quotes/history/quote-history-format';

import type { QuoteHistoryEvent } from '@admin/clients/model';

export function QuoteEventHistoryTable({ rows }: { rows: readonly QuoteHistoryEvent[] }) {
  return (
    <TableContainer>
      <Table size="small" aria-label="Дії з КП">
        <TableHead>
          <TableRow>
            <TableCell>Дія</TableCell>
            <TableCell>Версія / ревізія</TableCell>
            <TableCell>Автор</TableCell>
            <TableCell>Відповідальний</TableCell>
            <TableCell>Причина</TableCell>
            <TableCell>Час (Київ)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.publicId}>
              <TableCell>{quoteHistoryAction(row.action)}</TableCell>
              <TableCell>
                {row.versionNumber} / {row.revision}
              </TableCell>
              <TableCell>#{row.actorId}</TableCell>
              <TableCell>
                {row.previousOwnerId !== null ? `#${row.previousOwnerId} → ` : ''}#{row.ownerId}
              </TableCell>
              <TableCell>{row.reason || '—'}</TableCell>
              <TableCell>{quoteHistoryDate(row.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
