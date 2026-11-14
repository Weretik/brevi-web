import { forecastReasonLabels, formatDay } from '@admin/production/model';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import {
  Box,
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

import type { ForecastRow } from '@admin/production/model';

interface Props {
  rows: readonly ForecastRow[];
  /** Show sewing minutes: only for people who see the rate. */
  showMinutes: boolean;
  busy?: boolean;
  /** Absent: the person may not reorder. */
  onMove?: (index: number, by: -1 | 1) => void;
}

const minutes = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 });
const mono = { fontFamily: 'var(--admin-font-mono)', whiteSpace: 'nowrap' } as const;

/** The problem of a row, if any: no date, or sewing ends after «Готово до». */
export function forecastRowProblem(row: ForecastRow): string | null {
  if (row.reason) return forecastReasonLabels[row.reason];
  if (row.isLate) return `Пошиття закінчиться пізніше «Готово до» ${formatDay(row.dueDate)}`;
  return null;
}

/** «Прогноз пошиття»: the queue in the order it is sewn. */
export function SewingForecastTable({ rows, showMinutes, busy = false, onMove }: Props) {
  if (rows.length === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        Немає завдань «Нове» для пошиття.
      </Typography>
    );
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Черга пошиття">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 48 }}>#</TableCell>
            <TableCell>Завдання</TableCell>
            <TableCell>Менеджер</TableCell>
            <TableCell align="right">Залишилось, шт.</TableCell>
            {showMinutes && <TableCell align="right">Хвилин</TableCell>}
            <TableCell>Готово до</TableCell>
            <TableCell>Орієнтовне завершення</TableCell>
            {onMove && <TableCell sx={{ width: 96 }} />}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => {
            const problem = forecastRowProblem(row);
            return (
              <TableRow key={row.orderId}>
                <TableCell sx={mono}>{index + 1}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {problem && (
                      <Tooltip title={problem}>
                        <ErrorOutlineOutlinedIcon
                          fontSize="small"
                          color="error"
                          aria-label={problem}
                        />
                      </Tooltip>
                    )}
                    <Box>
                      <Link href={`/production/orders/${row.orderId}`}>№ {row.orderNumber}</Link> ·{' '}
                      {row.clientName}
                      {problem && (
                        <Typography variant="caption" color="error" component="div">
                          {problem}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{row.managerName}</TableCell>
                <TableCell align="right" sx={mono}>
                  {row.remaining}
                </TableCell>
                {showMinutes && (
                  <TableCell align="right" sx={mono}>
                    {row.minutes === null ? '—' : minutes.format(row.minutes)}
                  </TableCell>
                )}
                <TableCell sx={mono}>{formatDay(row.dueDate)}</TableCell>
                <TableCell sx={{ ...mono, fontWeight: 600 }}>
                  {row.status === 'Complete' ? 'Пошито' : formatDay(row.finishOn)}
                </TableCell>
                {onMove && (
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <IconButton
                      size="small"
                      aria-label={`Вище: № ${row.orderNumber}`}
                      disabled={busy || index === 0}
                      onClick={() => onMove(index, -1)}
                    >
                      <ArrowUpwardOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label={`Нижче: № ${row.orderNumber}`}
                      disabled={busy || index === rows.length - 1}
                      onClick={() => onMove(index, 1)}
                    >
                      <ArrowDownwardOutlinedIcon fontSize="small" />
                    </IconButton>
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
