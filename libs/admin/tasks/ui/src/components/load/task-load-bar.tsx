import { Box } from '@mui/material';

import type { TaskLoad } from '@admin/tasks/model';

/** Open tasks of one manager: red overdue, orange urgent, blue the rest. */
export function TaskLoadBar({ row }: { row: TaskLoad }) {
  if (row.open === 0) return <Box sx={{ height: 5, borderRadius: 2, bgcolor: 'action.hover' }} />;
  const part = (count: number) => `${(count / row.open) * 100}%`;
  const urgent = Math.min(row.urgent, row.open - row.overdue);
  const rest = row.open - row.overdue - urgent;
  return (
    <Box
      aria-hidden
      sx={{
        display: 'flex',
        height: 5,
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'action.hover',
      }}
    >
      <Box sx={{ width: part(row.overdue), bgcolor: 'error.main' }} />
      <Box sx={{ width: part(urgent), bgcolor: 'primary.main' }} />
      <Box sx={{ width: part(rest), bgcolor: 'info.main' }} />
    </Box>
  );
}
