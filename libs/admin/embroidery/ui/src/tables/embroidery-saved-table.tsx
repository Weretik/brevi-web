import {
  embroideryModeLabels,
  embroiderySavedTitle,
  formatEmbroideryDateTime,
  formatEmbroideryMoney,
  formatEmbroideryNumber,
} from '@admin/embroidery/model';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { EmbroiderySavedSummary } from '@admin/embroidery/model';

interface Props {
  rows: readonly EmbroiderySavedSummary[];
  onOpen: (row: EmbroiderySavedSummary) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };
const numeric = { ...mono, textAlign: 'right', whiteSpace: 'nowrap' } as const;

/** «Збережені»: one row per saved calculation; the middle price is «Стандарт». */
export function EmbroiderySavedTable({ rows, onOpen }: Props) {
  return (
    <TableContainer>
      <Table size="small" aria-label="Збережені розрахунки">
        <TableHead>
          <TableRow>
            <TableCell>Номер</TableCell>
            <TableCell>Назва і клієнт</TableCell>
            <TableCell>Що вишиваємо</TableCell>
            <TableCell sx={{ textAlign: 'right' }}>Ціни за 1 шт, грн</TableCell>
            <TableCell>Збережено</TableCell>
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
              <TableCell sx={{ ...mono, whiteSpace: 'nowrap' }}>{row.number}</TableCell>
              <TableCell>
                <Typography variant="body2" color={row.name ? 'text.primary' : 'text.secondary'}>
                  {embroiderySavedTitle(row.name)}
                </Typography>
                {row.customerName && (
                  <Typography variant="caption" color="text.secondary">
                    {row.customerName}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Typography variant="body2">{embroideryModeLabels[row.mode]}</Typography>
                <Typography variant="caption" color="text.secondary" sx={mono}>
                  {formatEmbroideryNumber(row.quantity)} шт ·{' '}
                  {formatEmbroideryNumber(row.stitchesPerUnit)} ст. · {row.hoopLabel}
                </Typography>
              </TableCell>
              <TableCell sx={numeric}>
                {row.prices.map((price) => formatEmbroideryMoney(price.unit)).join(' / ')}
                {row.incomplete && (
                  <Typography component="p" variant="caption" color="warning.main">
                    Орієнтовна
                  </Typography>
                )}
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                <Typography variant="body2" sx={mono}>
                  {formatEmbroideryDateTime(row.createdAt)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {row.createdByName}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
