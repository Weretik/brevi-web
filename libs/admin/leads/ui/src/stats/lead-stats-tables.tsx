import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

import { LeadStatsCard } from './lead-stats-card';
import { mono } from '../components/mono';

import type { LeadStats } from '@admin/leads/model';

const num = { ...mono, textAlign: 'right' } as const;

function Empty({ text }: { text: string }) {
  return (
    <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1.5 }}>
      {text}
    </Typography>
  );
}

/** «Менеджери»: who works the leads and how it goes in the period. */
export function LeadManagersTable({ stats }: { stats: LeadStats }) {
  const sum = (pick: (x: LeadStats['managers'][number]) => number) =>
    stats.managers.reduce((a, x) => a + pick(x), 0);
  return (
    <LeadStatsCard title="Менеджери">
      {stats.managers.length === 0 ? (
        <Empty text="Ще ніхто не взяв лідів" />
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

/** «Результати дзвінків» of the period as bars. */
export function LeadResultsBars({ stats }: { stats: LeadStats }) {
  const max = Math.max(1, ...stats.results.map((x) => x.count));
  return (
    <LeadStatsCard title="Результати дзвінків">
      {stats.results.length === 0 ? (
        <Empty text="За період дзвінків немає" />
      ) : (
        <Box
          component="ul"
          sx={{ listStyle: 'none', m: 0, px: 2, py: 1.75, display: 'grid', gap: 1.25 }}
        >
          {stats.results.map((row) => (
            <Box
              component="li"
              key={row.name}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(120px, 170px) minmax(0, 1fr) 36px',
                gap: 1.25,
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" noWrap title={row.name}>
                {row.name}
              </Typography>
              <Box sx={{ height: 8, borderRadius: 999, bgcolor: 'action.hover' }} aria-hidden>
                <Box
                  sx={{
                    height: 8,
                    borderRadius: 999,
                    bgcolor: 'primary.main',
                    width: `${(row.count / max) * 100}%`,
                  }}
                />
              </Box>
              <Typography variant="body2" sx={num}>
                {row.count}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </LeadStatsCard>
  );
}

/** «Ліди за категорією і галуззю». */
export function LeadIndustriesTable({ stats }: { stats: LeadStats }) {
  const count = (row: LeadStats['industries'][number], code: string) =>
    row.categories.find((x) => x.name === code)?.count ?? 0;
  return (
    <LeadStatsCard title="Ліди за категорією і галуззю">
      {stats.industries.length === 0 ? (
        <Empty text="Лідів ще немає" />
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Галузь</TableCell>
                {stats.categories.map((code) => (
                  <TableCell key={code} sx={num}>
                    {code}
                  </TableCell>
                ))}
                <TableCell sx={num}>Разом</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.industries.map((row) => (
                <TableRow key={row.industry}>
                  <TableCell>{row.industry}</TableCell>
                  {stats.categories.map((code) => (
                    <TableCell key={code} sx={num}>
                      {count(row, code) || ''}
                    </TableCell>
                  ))}
                  <TableCell sx={{ ...num, fontWeight: 600 }}>{row.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </LeadStatsCard>
  );
}
