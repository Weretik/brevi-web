import { formatDay, formatMoney, productionWorkKindLabels } from '@admin/production/model';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import {
  IconButton,
  Link,
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
import { Link as RouterLink } from 'react-router-dom';

import type { ProductionWork } from '@admin/production/model';

interface Props {
  rows: readonly ProductionWork[];
  /** Show the order and model: the log has many items, an item section has one. */
  showItem?: boolean;
  busy?: boolean;
  /** Absent: the person may not cancel this record. */
  canVoid?: (row: ProductionWork) => boolean;
  onVoid?: (row: ProductionWork) => void;
  empty?: string;
}

function details(row: ProductionWork) {
  return [
    row.overPlan ? `Понад план: ${row.reason ?? ''}` : null,
    row.comment,
    row.isVoided
      ? `Сторно${row.voidedByName ? ` · ${row.voidedByName}` : ''}${row.voidReason ? `: ${row.voidReason}` : ''}`
      : null,
  ]
    .filter(Boolean)
    .join(' · ');
}

const mono = { fontFamily: 'var(--admin-font-mono)', whiteSpace: 'nowrap' } as const;

/** Records of «Журнал робіт», newest first; a cancelled one stays crossed out. */
export function ProductionWorkTable({
  rows,
  showItem = false,
  busy = false,
  canVoid,
  onVoid,
  empty = 'Записів роботи ще немає.',
}: Props) {
  if (rows.length === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        {empty}
      </Typography>
    );
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Записи роботи">
        <TableHead>
          <TableRow>
            <TableCell>Дата</TableCell>
            <TableCell>Працівник</TableCell>
            {showItem && <TableCell>Завдання</TableCell>}
            <TableCell>Робота</TableCell>
            <TableCell align="right">Шт.</TableCell>
            <TableCell align="right">Розцінка</TableCell>
            <TableCell>Деталі</TableCell>
            {onVoid && <TableCell padding="checkbox" />}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} sx={{ opacity: row.isVoided ? 0.6 : 1 }}>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDay(row.workDate)}</TableCell>
              <TableCell>{row.employeeName}</TableCell>
              {showItem && (
                <TableCell>
                  <Link component={RouterLink} to={`/production/orders/${row.orderId}`}>
                    № {row.orderNumber}
                  </Link>{' '}
                  · {row.modelName}
                  <Typography variant="caption" color="text.secondary" component="div">
                    {row.clientName}
                  </Typography>
                </TableCell>
              )}
              <TableCell>{productionWorkKindLabels[row.kind]}</TableCell>
              <TableCell
                align="right"
                sx={{ ...mono, textDecoration: row.isVoided ? 'line-through' : undefined }}
              >
                {row.quantity}
              </TableCell>
              <TableCell align="right" sx={mono}>
                {formatMoney(row.rate)}
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {details(row)}
                </Typography>
              </TableCell>
              {onVoid && (
                <TableCell padding="checkbox">
                  {!row.isVoided && (canVoid?.(row) ?? true) && (
                    <Tooltip title="Сторно">
                      <span>
                        <IconButton
                          size="small"
                          aria-label={`Сторнувати роботу ${row.employeeName} ${formatDay(row.workDate)}`}
                          disabled={busy}
                          onClick={() => onVoid(row)}
                        >
                          <UndoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
