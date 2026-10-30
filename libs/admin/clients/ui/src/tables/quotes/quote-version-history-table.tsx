import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import {
  quoteHistoryAction,
  quoteHistoryDate,
} from '../../components/quotes/history/quote-history-format';

import type { QuoteVersionSummary } from '@admin/clients/model';

export function QuoteVersionHistoryTable({
  rows,
  selectedId,
  disabled,
  onSelect,
}: {
  rows: readonly QuoteVersionSummary[];
  selectedId: string;
  disabled: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <TableContainer>
      <Table size="small" aria-label="Версії КП">
        <TableHead>
          <TableRow>
            <TableCell>Версія</TableCell>
            <TableCell>Дія</TableCell>
            <TableCell>Автор</TableCell>
            <TableCell>Час (Київ)</TableCell>
            <TableCell>Попередня версія</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.publicId} selected={row.publicId === selectedId}>
              <TableCell>
                <Button
                  disabled={disabled}
                  aria-pressed={row.publicId === selectedId}
                  onClick={() => onSelect(row.publicId)}
                >
                  Переглянути версію {row.versionNumber}
                </Button>
              </TableCell>
              <TableCell>{quoteHistoryAction(row.action)}</TableCell>
              <TableCell>#{row.actorId}</TableCell>
              <TableCell>{quoteHistoryDate(row.createdAt)}</TableCell>
              <TableCell>
                {row.parentVersionId ? (
                  <Button disabled={disabled} onClick={() => onSelect(row.parentVersionId!)}>
                    Попередня до {row.versionNumber}
                  </Button>
                ) : (
                  '—'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
