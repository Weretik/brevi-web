import {
  formatDay,
  formatMeters,
  formatPerProduct,
  movementCancelMark,
  movementOperationLabel,
  movementSource,
} from '@admin/warehouse/model';
import { TableCell, TableRow, Typography } from '@mui/material';

import type { FabricMovementRow } from '@admin/warehouse/model';

interface Props {
  row: FabricMovementRow;
  onOpen: (row: FabricMovementRow) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

const signed = (delta: number) =>
  `${delta > 0 ? '+' : delta < 0 ? '−' : ''}${formatMeters(Math.abs(delta))}`;

/** One movement of the journal: date, operation, pair, source, signed quantity and the pair balance after it. */
export function FabricMovementTableRow({ row, onOpen }: Props) {
  const cancelled = movementCancelMark(row);
  const dim = cancelled ? { color: 'text.disabled' } : undefined;
  const operation = movementOperationLabel(row);
  const balance = row.pairMetersAfter ?? row.metersAfter;
  return (
    <TableRow
      hover
      tabIndex={0}
      aria-label={`${operation}: ${row.fabricName}, ${row.color}, ${formatDay(row.operationDate)}`}
      sx={{
        cursor: 'pointer',
        '&:focus-visible': { outline: 2, outlineColor: 'primary.main' },
      }}
      onClick={() => onOpen(row)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen(row);
        }
      }}
    >
      <TableCell sx={{ ...mono, whiteSpace: 'nowrap', ...dim }}>
        {formatDay(row.operationDate)}
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Typography variant="body2" component="span" sx={dim}>
          {operation}
        </Typography>
        {cancelled && (
          <Typography variant="caption" color="warning.main" component="div">
            {cancelled}
          </Typography>
        )}
      </TableCell>
      <TableCell sx={dim}>
        <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
          {row.fabricName}
        </Typography>
        <Typography variant="body2" component="span" color="text.secondary">
          {' · '}
          {row.color}
        </Typography>
        <Typography variant="caption" color="text.secondary" component="div" sx={mono}>
          {row.fabricCode}
          {row.fabricCode !== row.groupCode && ` → ${row.groupCode}`}
        </Typography>
      </TableCell>
      <TableCell sx={{ maxWidth: 320, ...dim }}>
        <Typography variant="body2" noWrap title={movementSource(row) ?? undefined}>
          {movementSource(row) ?? '—'}
        </Typography>
        {row.perProduct !== null && (
          <Typography variant="caption" color="text.secondary" component="div">
            {formatPerProduct(row.perProduct)} на 1 виріб
          </Typography>
        )}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          ...mono,
          whiteSpace: 'nowrap',
          fontWeight: 600,
          color: cancelled ? 'text.disabled' : row.delta > 0 ? 'success.main' : undefined,
          textDecoration: cancelled ? 'line-through' : undefined,
        }}
      >
        {signed(row.delta)}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          ...mono,
          whiteSpace: 'nowrap',
          color: balance < 0 ? 'error.main' : undefined,
        }}
      >
        {formatMeters(balance)}
      </TableCell>
    </TableRow>
  );
}
