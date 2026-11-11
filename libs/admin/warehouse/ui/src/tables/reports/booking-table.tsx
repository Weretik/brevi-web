import { fabricLayerLabels, formatDay, formatMeters } from '@admin/warehouse/model';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { ExpandableRow, reportMono } from '../../components/reports/expandable-row';
import { OrderLink } from '../../components/reports/order-link';

import type { BookingPair, BookingUnknown } from '@admin/warehouse/model';

interface Props {
  pairs: readonly BookingPair[];
  searching: boolean;
}

const toOrderSx = (value: number) => ({
  ...reportMono,
  color: value > 0 ? 'error.main' : undefined,
});

/** «Бронь і що замовити»: a fabric and colour, then its queue of items in order of the orders. */
export function BookingTable({ pairs, searching }: Props) {
  if (pairs.length === 0)
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary">
          {searching ? 'За цим пошуком нічого немає.' : 'Відкриті завдання нічого не потребують.'}
        </Typography>
      </Paper>
    );
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Бронь і потреба в тканині">
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell />
            <TableCell>Тканина / колір</TableCell>
            <TableCell align="right">На складі</TableCell>
            <TableCell align="right">Потреба</TableCell>
            <TableCell align="right">Бронь</TableCell>
            <TableCell align="right">Вільно</TableCell>
            <TableCell align="right">Замовити</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pairs.map((pair) => (
            <ExpandableRow
              key={`${pair.fabricCode}|${pair.color}`}
              label={`${pair.fabricName}, ${pair.color}`}
              columns={7}
              cells={
                <>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {pair.fabricName} · {pair.color}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={reportMono}>
                      {pair.fabricCode}
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ ...reportMono, color: pair.stock < 0 ? 'error.main' : undefined }}
                  >
                    {formatMeters(pair.stock)}
                  </TableCell>
                  <TableCell align="right" sx={reportMono}>
                    {formatMeters(pair.need)}
                  </TableCell>
                  <TableCell align="right" sx={reportMono}>
                    {formatMeters(pair.reserved)}
                  </TableCell>
                  <TableCell align="right" sx={reportMono}>
                    {formatMeters(pair.free)}
                  </TableCell>
                  <TableCell align="right" sx={toOrderSx(pair.toOrder)}>
                    {formatMeters(pair.toOrder)}
                  </TableCell>
                </>
              }
            >
              {pair.shortage > 0 && (
                <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                  На складі вже нестача {formatMeters(pair.shortage)}: її теж треба замовити.
                </Typography>
              )}
              {pair.items.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Відкриті завдання цю тканину не потребують.
                </Typography>
              ) : (
                <Table size="small" aria-label={`Завдання: ${pair.fabricName}, ${pair.color}`}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Завдання / замовник</TableCell>
                      <TableCell>Модель</TableCell>
                      <TableCell align="right">План</TableCell>
                      <TableCell align="right">Покрито видачею</TableCell>
                      <TableCell align="right">Ще потрібно</TableCell>
                      <TableCell align="right">У броні</TableCell>
                      <TableCell align="right">Замовити</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pair.items.map((item) => (
                      <TableRow key={`${item.itemId}|${item.layer}`}>
                        <TableCell>
                          <OrderLink orderId={item.orderId} orderNumber={item.orderNumber} /> ·{' '}
                          {item.clientName}
                          {item.dueDate && (
                            <Typography variant="caption" color="text.secondary" component="div">
                              до {formatDay(item.dueDate)}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {item.modelName}
                          {item.layer !== 'Upper' && (
                            <Typography variant="caption" color="text.secondary" component="div">
                              {fabricLayerLabels[item.layer]}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right" sx={reportMono}>
                          {formatMeters(item.plan)}
                        </TableCell>
                        <TableCell align="right" sx={reportMono}>
                          {formatMeters(item.covered)}
                        </TableCell>
                        <TableCell align="right" sx={reportMono}>
                          {formatMeters(item.remaining)}
                        </TableCell>
                        <TableCell align="right" sx={reportMono}>
                          {formatMeters(item.reserved)}
                        </TableCell>
                        <TableCell align="right" sx={toOrderSx(item.toOrder)}>
                          {formatMeters(item.toOrder)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ExpandableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/** Items whose need is unknown: not counted as zero. */
export function BookingUnknownTable({ rows }: { rows: readonly BookingUnknown[] }) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Невідомий план">
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell>Завдання / замовник</TableCell>
            <TableCell>Модель</TableCell>
            <TableCell>Чому потреба невідома</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={`${row.itemId}|${index}`}>
              <TableCell>
                <OrderLink orderId={row.orderId} orderNumber={row.orderNumber} /> · {row.clientName}
              </TableCell>
              <TableCell>{row.modelName}</TableCell>
              <TableCell>{row.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
