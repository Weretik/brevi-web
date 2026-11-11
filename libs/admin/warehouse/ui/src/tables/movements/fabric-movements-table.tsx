import {
  fabricMovementKindLabels,
  formatDay,
  formatKyivTime,
  formatMeters,
  movementTarget,
} from '@admin/warehouse/model';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
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
  /** Edit and «Скасувати» of rows with `canEdit`, for people who may move stock. */
  onEdit?: ((row: FabricMovementRow) => void) | null;
  onVoid?: ((row: FabricMovementRow) => void) | null;
  /** «Історія правок» of a changed row; everyone with access reads it. */
  onHistory?: ((row: FabricMovementRow) => void) | null;
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
export function FabricMovementsTable({
  rows,
  filtered,
  onReverse,
  onEdit = null,
  onVoid = null,
  onHistory = null,
}: Props) {
  const actions = Boolean(onReverse || onEdit || onVoid || onHistory);
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
            {actions && <TableCell aria-label="Дії" />}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const struck = row.isReversed ? { textDecoration: 'line-through' } : undefined;
            const label = `${kindLabel(row)} ${row.fabricName} ${row.color}`;
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
                  {row.isVoided && (
                    <Typography variant="caption" color="warning.main" component="div">
                      Скасовано
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
                {actions && (
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap', px: 0.5 }}>
                    {onEdit && row.canEdit && !row.isVoided && (
                      <Tooltip title="Редагувати">
                        <IconButton
                          size="small"
                          aria-label={`Редагувати: ${label}`}
                          onClick={() => onEdit(row)}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onVoid && row.canEdit && !row.isVoided && (
                      <Tooltip title="Скасувати">
                        <IconButton
                          size="small"
                          aria-label={`Скасувати: ${label}`}
                          onClick={() => onVoid(row)}
                        >
                          <BlockOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onReverse && row.canReverse && (
                      <Tooltip title="Сторно">
                        <IconButton
                          size="small"
                          aria-label={`Сторно: ${label}`}
                          onClick={() => onReverse(row)}
                        >
                          <UndoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onHistory && row.revision > 0 && (
                      <Tooltip title="Історія правок">
                        <IconButton
                          size="small"
                          aria-label={`Історія правок: ${label}`}
                          onClick={() => onHistory(row)}
                        >
                          <HistoryOutlinedIcon fontSize="small" />
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
