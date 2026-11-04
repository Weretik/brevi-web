import { fabricMovementKindLabels, formatDay, formatMeters } from '@admin/production/model';
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

import type { FabricMovement } from '@admin/production/model';

interface Props {
  movements: readonly FabricMovement[];
  busy?: boolean;
  /** Absent: the person may not reverse. */
  onReverse?: (movement: FabricMovement) => void;
}

const signed = (value: number) => (value > 0 ? `+${formatMeters(value)}` : formatMeters(value));

function what(movement: FabricMovement) {
  return [
    movement.supplierName,
    movement.document,
    movement.note,
    movement.isReversed ? 'сторновано' : null,
  ]
    .filter(Boolean)
    .join(' · ');
}

/** History of a stock line, newest first: before, change, after and why. */
export function FabricMovementsTable({ movements, busy = false, onReverse }: Props) {
  if (movements.length === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        Рухів ще немає.
      </Typography>
    );
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 420 }}>
      <Table stickyHeader size="small" aria-label="Рухи тканини">
        <TableHead>
          <TableRow>
            <TableCell>Дата</TableCell>
            <TableCell>Рух</TableCell>
            <TableCell align="right">Було</TableCell>
            <TableCell align="right">Зміна</TableCell>
            <TableCell align="right">Стало</TableCell>
            <TableCell>Деталі</TableCell>
            {onReverse && <TableCell padding="checkbox" />}
          </TableRow>
        </TableHead>
        <TableBody>
          {movements.map((movement) => (
            <TableRow key={movement.id} sx={{ opacity: movement.isReversed ? 0.6 : 1 }}>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                {formatDay(movement.operationDate)}
              </TableCell>
              <TableCell>
                {fabricMovementKindLabels[movement.kind]}
                {movement.orderId !== null && movement.orderNumber !== null && (
                  <>
                    {' '}
                    <Link component={RouterLink} to={`/production/orders/${movement.orderId}`}>
                      № {movement.orderNumber}
                    </Link>
                  </>
                )}
              </TableCell>
              <TableCell align="right" sx={{ fontFamily: 'var(--admin-font-mono)' }}>
                {formatMeters(movement.metersBefore)}
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontFamily: 'var(--admin-font-mono)', fontWeight: 600 }}
              >
                {signed(movement.delta)}
              </TableCell>
              <TableCell align="right" sx={{ fontFamily: 'var(--admin-font-mono)' }}>
                {formatMeters(movement.metersAfter)}
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {what(movement) || movement.modelName || '—'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {movement.createdByName}
                </Typography>
              </TableCell>
              {onReverse && (
                <TableCell padding="checkbox">
                  {movement.canReverse && (
                    <Tooltip title="Сторно">
                      <IconButton
                        size="small"
                        disabled={busy}
                        aria-label={`Сторнувати: ${fabricMovementKindLabels[movement.kind]} ${signed(movement.delta)}`}
                        onClick={() => onReverse(movement)}
                      >
                        <UndoOutlinedIcon fontSize="small" />
                      </IconButton>
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
