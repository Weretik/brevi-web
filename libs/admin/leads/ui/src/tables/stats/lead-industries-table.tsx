import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { LeadStatsEmpty, num } from './lead-stats-cells';
import { LeadStatsCard } from '../../components/stats/lead-stats-card';

import type { LeadStats } from '@admin/leads/model';

/** «Ліди за категорією і галуззю». */
export function LeadIndustriesTable({ stats }: { stats: LeadStats }) {
  const count = (row: LeadStats['industries'][number], code: string) =>
    row.categories.find((x) => x.name === code)?.count ?? 0;
  return (
    <LeadStatsCard title="Ліди за категорією і галуззю">
      {stats.industries.length === 0 ? (
        <LeadStatsEmpty text="Лідів ще немає" />
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
