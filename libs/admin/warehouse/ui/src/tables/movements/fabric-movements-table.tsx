import {
  fabricMovementKindLabels,
  formatDay,
  formatKyivTime,
  formatMeters,
  movementTarget,
} from '@admin/warehouse/model';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';

import type { FabricMovementRow } from '@admin/warehouse/model';

interface Props {
  rows: readonly FabricMovementRow[];
  /** A filter hides everything: say so instead of «рухів ще немає». */
  filtered: boolean;
  /** «Сторно» for people who may move stock. */
  onReverse: ((row: FabricMovementRow) => void) | null;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

const kindLabel = (row: FabricMovementRow) =>
  row.kind === 'Issue' && row.orderId !== null
    ? 'Видача на завдання'
    : fabricMovementKindLabels[row.kind];

/**
 * «Рух тканини»: newest operation date first. The balance is the moved line's own; the merged
 * metres of a fabric and colour are on «Залишки».
 */
export function FabricMovementsTable({ rows, filtered, onReverse }: Props) {
  if (rows.length === 0)
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary">
          {filtered ? 'За цим фільтром рухів немає.' : 'Рухів тканини ще немає.'}
        </Typography>
      </Paper>
    );
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Рух тканини">
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell>Дата</TableCell>
            <TableCell>Вид</TableCell>
            <TableCell>Тканина і колір</TableCell>
            <TableCell>Постачальник / документ</TableCell>
            <TableCell>Замовлення / куди</TableCell>
            <TableCell align="right">Прихід</TableCell>
            <TableCell align="right">Витрата</TableCell>
            <TableCell align="right">Залишок рядка</TableCell>
            {onReverse && <TableCell aria-label="Дії" />}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const struck = row.isReversed ? { textDecoration: 'line-through' } : undefined;
            return (
              <TableRow key={row.id} sx={{ verticalAlign: 'top' }}>
                <TableCell>
                  <Typography variant="body2" sx={mono}>
                    {formatDay(row.operationDate)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" component="div">
                    записано {formatKyivTime(row.createdAt)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" component="div">
                    {row.createdByName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={struck}>
                    {kindLabel(row)}
                  </Typography>
                  {row.isReversed && (
                    <Typography variant="caption" color="error" component="div">
                      Сторновано
                    </Typography>
                  )}
                  {row.note && (
                    <Typography variant="caption" color="text.secondary" component="div">
                      {row.note}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {row.fabricName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" component="div">
                    <span style={{ fontFamily: 'var(--admin-font-mono)' }}>{row.fabricCode}</span>
                    {row.fabricCode !== row.groupCode && ` (на складі як ${row.groupCode})`} ·{' '}
                    {row.color}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{row.supplierName ?? '—'}</Typography>
                  {row.document && (
                    <Typography variant="caption" color="text.secondary" component="div">
                      {row.document}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{movementTarget(row) ?? '—'}</Typography>
                  {row.kind === 'Issue' && row.orderId === null && (
                    <Typography variant="caption" color="text.secondary" component="div">
                      Без замовлення
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right" sx={{ ...mono, ...struck }}>
                  {row.delta > 0 ? formatMeters(row.delta) : ''}
                </TableCell>
                <TableCell align="right" sx={{ ...mono, ...struck }}>
                  {row.delta < 0 ? formatMeters(-row.delta) : ''}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ ...mono, color: row.metersAfter < 0 ? 'error.main' : undefined }}
                >
                  {formatMeters(row.metersAfter)}
                </TableCell>
                {onReverse && (
                  <TableCell align="right" padding="checkbox">
                    {row.canReverse && (
                      <Tooltip title="Сторно">
                        <IconButton
                          size="small"
                          aria-label={`Сторно: ${kindLabel(row)} ${row.fabricName} ${row.color}`}
                          onClick={() => onReverse(row)}
                        >
                          <UndoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
