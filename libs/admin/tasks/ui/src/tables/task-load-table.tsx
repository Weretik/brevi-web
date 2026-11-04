import { UserAvatar } from '@admin/shared/ui';
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { TaskLoadBar } from '../components/load/task-load-bar';

import type { TaskLoad } from '@admin/tasks/model';

interface Props {
  load: readonly TaskLoad[];
  loading: boolean;
  onOpen: (userId: number) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

const legend = [
  { label: 'Прострочено', color: 'error.main' },
  { label: 'Терміново', color: 'primary.main' },
  { label: 'У роботі', color: 'info.main' },
];

/**
 * «Навантаження» tab (L3): one row per manager with every count; a click on a row opens
 * «Завдання» filtered to that manager.
 */
export function TaskLoadTable({ load, loading, onOpen }: Props) {
  const number = (value: number, alert = false) => (
    <TableCell
      align="right"
      sx={{
        ...mono,
        color: alert && value > 0 ? 'error.main' : undefined,
        fontWeight: alert && value > 0 ? 600 : 400,
      }}
    >
      {value}
    </TableCell>
  );

  return (
    <Box>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 2, mb: 1.5 }}>
        {legend.map((item) => (
          <Stack key={item.label} direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 12, height: 5, borderRadius: 1, bgcolor: item.color }} />
            <Typography variant="caption" color="text.secondary">
              {item.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small" aria-label="Навантаження менеджерів" sx={{ minWidth: 760 }}>
          <TableHead>
            <TableRow>
              <TableCell>Менеджер</TableCell>
              <TableCell align="right">Відкриті</TableCell>
              <TableCell align="right">Простр.</TableCell>
              <TableCell align="right">Термін.</TableCell>
              <TableCell align="right">У роботі</TableCell>
              <TableCell align="right">Виконано · 7 дн</TableCell>
              <TableCell align="right">Вчасно · 30 дн</TableCell>
              <TableCell sx={{ width: '22%' }}>Навантаження</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {load.map((row) => (
              <TableRow
                key={row.userId}
                hover
                tabIndex={0}
                aria-label={`Показати завдання: ${row.name}`}
                onClick={() => onOpen(row.userId)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onOpen(row.userId);
                  }
                }}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                    <UserAvatar name={row.name} size={24} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                      {row.name}
                    </Typography>
                  </Stack>
                </TableCell>
                {number(row.open)}
                {number(row.overdue, true)}
                {number(row.urgent)}
                {number(row.inProgress)}
                {number(row.doneLastWeek)}
                <TableCell align="right" sx={mono}>
                  {row.onTimePercent === null ? '—' : `${row.onTimePercent}%`}
                </TableCell>
                <TableCell>
                  <TaskLoadBar row={row} />
                </TableCell>
              </TableRow>
            ))}
            {load.length === 0 && (
              <TableRow>
                <TableCell colSpan={8}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    {loading
                      ? 'Завантаження…'
                      : 'Менеджерів ще немає. Додайте роль «Менеджер» у «Користувачі».'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
