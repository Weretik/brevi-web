import { formatReminderDate } from '@admin/reminders/model';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
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
} from '@mui/material';

import type { NonWorkingDay } from '@admin/reminders/model';

const weekdays = ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'пʼятниця', 'субота'];

function weekday(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return weekdays[new Date(Date.UTC(year ?? 0, (month ?? 1) - 1, day ?? 1)).getUTCDay()] ?? '';
}

interface Props {
  days: readonly NonWorkingDay[];
  busyDate: string | null;
  onRemove: (day: NonWorkingDay) => void;
}

export function NonWorkingDaysTable({ days, busyDate, onRemove }: Props) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Неробочі дні">
        <TableHead>
          <TableRow>
            <TableCell>Дата</TableCell>
            <TableCell>День тижня</TableCell>
            <TableCell>Примітка</TableCell>
            <TableCell width={56} />
          </TableRow>
        </TableHead>
        <TableBody>
          {days.map((day) => (
            <TableRow key={day.date} hover>
              <TableCell
                sx={{ fontFamily: 'var(--brevi-font-mono)', fontVariantNumeric: 'tabular-nums' }}
              >
                {formatReminderDate(day.date)}
              </TableCell>
              <TableCell>{weekday(day.date)}</TableCell>
              <TableCell>{day.note ?? '—'}</TableCell>
              <TableCell>
                <Tooltip title="Прибрати">
                  <span>
                    <IconButton
                      size="small"
                      aria-label={`Прибрати ${formatReminderDate(day.date)}`}
                      disabled={busyDate === day.date}
                      onClick={() => onRemove(day)}
                    >
                      <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
