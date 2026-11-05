import { formatDay, formatHours } from '@admin/production/model';
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { TimesheetMonth } from '@admin/production/model';

interface Props {
  month: TimesheetMonth;
  selected: string;
  onPick: (date: string) => void;
}

/** «Архів табеля»: the marked days of the month and the hours of each worker. */
export function TimesheetMonthSummary({ month, selected, onPick }: Props) {
  if (month.days.length === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        За цей місяць відміток ще немає.
      </Typography>
    );
  const days = month.employees.reduce((sum, row) => sum + row.days, 0);
  const minutes = month.employees.reduce((sum, row) => sum + row.minutes, 0);
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} sx={{ gap: 2, alignItems: 'flex-start' }}>
      <Box sx={{ minWidth: 0, flex: '0 0 auto' }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Дні
        </Typography>
        <Stack direction="row" sx={{ gap: 0.75, flexWrap: 'wrap', maxWidth: 420 }}>
          {month.days.map((day) => (
            <Button
              key={day.date}
              size="small"
              variant={day.date === selected ? 'contained' : 'outlined'}
              onClick={() => onPick(day.date)}
              sx={{ flexDirection: 'column', lineHeight: 1.2, py: 0.5 }}
            >
              <span>{formatDay(day.date).slice(0, 5)}</span>
              <Typography variant="caption" component="span">
                {day.people} ос. · {formatHours(day.minutes)} год
              </Typography>
            </Button>
          ))}
        </Stack>
      </Box>
      <TableContainer component={Paper} variant="outlined" sx={{ flex: 1, minWidth: 0 }}>
        <Table size="small" aria-label="Години за місяць">
          <TableHead>
            <TableRow>
              <TableCell>Працівник</TableCell>
              <TableCell align="right">Днів</TableCell>
              <TableCell align="right">Годин</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {month.employees.map((row) => (
              <TableRow key={row.employeeId}>
                <TableCell>
                  {row.name}
                  <Typography variant="caption" color="text.secondary" component="div">
                    {row.position}
                  </Typography>
                </TableCell>
                <TableCell align="right">{row.days}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {formatHours(row.minutes)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Разом</TableCell>
              <TableCell align="right">{days}</TableCell>
              <TableCell align="right">{formatHours(minutes)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Stack>
  );
}
