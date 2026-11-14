import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { LeadStatsEmpty, num } from './lead-stats-cells';
import { LeadStatsCard } from '../../components/stats/lead-stats-card';

import type { LeadStats } from '@admin/leads/model';

/** «Менеджери»: who works the leads and how it goes in the period. */
export function LeadManagersTable({ stats }: { stats: LeadStats }) {
  const sum = (pick: (x: LeadStats['managers'][number]) => number) =>
    stats.managers.reduce((a, x) => a + pick(x), 0);
  return (
    <LeadStatsCard title="Менеджери">
      {stats.managers.length === 0 ? (
        <LeadStatsEmpty text="Ще ніхто не взяв лідів" />
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Менеджер</TableCell>
                <TableCell sx={num}>Лідів у роботі</TableCell>
                <TableCell sx={num}>Дзвінків</TableCell>
                <TableCell sx={num}>Дозвонились</TableCell>
                <TableCell sx={num}>Пропозицій</TableCell>
                <TableCell sx={num}>Клієнтів</TableCell>
                <TableCell sx={num}>Прострочено</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.managers.map((row) => (
                <TableRow key={row.manager.userId}>
                  <TableCell>{row.manager.name}</TableCell>
                  <TableCell sx={num}>{row.inWork}</TableCell>
                  <TableCell sx={num}>{row.calls}</TableCell>
                  <TableCell sx={num}>
                    {row.reachedPercent === null ? '—' : `${row.reachedPercent}%`}
                  </TableCell>
                  <TableCell sx={num}>{row.offers}</TableCell>
                  <TableCell sx={num}>{row.clients}</TableCell>
                  <TableCell sx={{ ...num, color: row.overdue ? 'error.main' : undefined }}>
                    {row.overdue}
                  </TableCell>
                </TableRow>
              ))}
              {stats.managers.length > 1 && (
                <TableRow sx={{ '& td': { fontWeight: 700 } }}>
                  <TableCell>Разом</TableCell>
                  <TableCell sx={num}>{sum((x) => x.inWork)}</TableCell>
                  <TableCell sx={num}>{sum((x) => x.calls)}</TableCell>
                  <TableCell sx={num} />
                  <TableCell sx={num}>{sum((x) => x.offers)}</TableCell>
                  <TableCell sx={num}>{sum((x) => x.clients)}</TableCell>
                  <TableCell sx={num}>{sum((x) => x.overdue)}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      )}
    </LeadStatsCard>
  );
}
