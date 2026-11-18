import { bookingCoverage, formatDay, formatMetersNumber, isDueSoon } from '@admin/warehouse/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, Chip, LinearProgress, TableCell, TableRow, Typography } from '@mui/material';

import { reportMono } from '../../../components/reports/expandable-row';
import { OrderLink } from '../../../components/reports/order-link';

import type { BookingPair } from '@admin/warehouse/model';
import type { KeyboardEvent } from 'react';

interface Props {
  pair: BookingPair;
  today: string;
  onReceive: ((pair: BookingPair) => void) | null;
  onOpen: (pair: BookingPair) => void;
}

const number = formatMetersNumber;

/** The task whose date is «Потрібно до». */
const dueTask = (pair: BookingPair) =>
  pair.needBy === null ? undefined : pair.items.find((x) => x.dueDate === pair.needBy);

const activate = (event: KeyboardEvent, action: () => void) => {
  if (event.target !== event.currentTarget) return;
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    action();
  }
};

/** One fabric and colour of «Що замовити»: supplier, «Потрібно до», coverage, what to order and «+ Прихід». */
export function BookingTableRow({ pair, today, onReceive, onOpen }: Props) {
  const task = dueTask(pair);
  const soon = pair.toOrder > 0 && isDueSoon(pair.needBy, today);
  const coverage = bookingCoverage(pair);
  return (
    <TableRow
      hover
      tabIndex={0}
      aria-label={`${pair.fabricName}, ${pair.color}`}
      sx={{ cursor: 'pointer' }}
      onClick={() => onOpen(pair)}
      onKeyDown={(event) => activate(event, () => onOpen(pair))}
    >
      <TableCell>
        <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
          {pair.fabricName} · {pair.color}
        </Typography>
        <Typography variant="caption" color="text.secondary" component="div" sx={reportMono}>
          {pair.fabricCode}
        </Typography>
        {pair.shortage > 0 && (
          <Chip
            size="small"
            color="error"
            variant="outlined"
            label={`На складі мінус ${number(pair.shortage)} м`}
            sx={{ mt: 0.5 }}
          />
        )}
      </TableCell>
      <TableCell>
        {pair.supplier ?? (
          <Typography variant="body2" color="text.secondary" component="span">
            —
          </Typography>
        )}
      </TableCell>
      <TableCell>
        {pair.needBy ? (
          <>
            <Typography
              variant="body2"
              sx={{ ...reportMono, color: soon ? 'error.main' : undefined }}
            >
              {formatDay(pair.needBy)}
            </Typography>
            {task && (
              <Typography variant="caption" color="text.secondary" component="div">
                <Box component="span" onClick={(event) => event.stopPropagation()}>
                  <OrderLink orderId={task.orderId} orderNumber={task.orderNumber} />
                </Box>{' '}
                · {task.clientName}
              </Typography>
            )}
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            без терміну
          </Typography>
        )}
      </TableCell>
      <TableCell>
        <LinearProgress
          variant="determinate"
          value={coverage * 100}
          color={coverage < 1 ? 'warning' : 'primary'}
          aria-label={`Покриття ${Math.round(coverage * 100)}%`}
          sx={{ height: 6, borderRadius: 3 }}
        />
        <Typography variant="caption" color="text.secondary" sx={reportMono}>
          є {number(pair.reserved)} з {number(pair.need)}
        </Typography>
      </TableCell>
      <TableCell
        align="right"
        sx={{
          ...reportMono,
          fontWeight: 600,
          color: pair.toOrder > 0 ? 'error.main' : 'text.secondary',
        }}
      >
        {pair.toOrder > 0 ? number(pair.toOrder) : '—'}
      </TableCell>
      {onReceive && (
        <TableCell align="right">
          <Button
            size="small"
            startIcon={<AddOutlinedIcon />}
            aria-label={`Прихід: ${pair.fabricName}, ${pair.color}`}
            onClick={(event) => {
              event.stopPropagation();
              onReceive(pair);
            }}
          >
            Прихід
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
}
