import { UserAvatar } from '@admin/shared/ui';
import { Box, ButtonBase, Paper, Stack, Typography } from '@mui/material';

import type { TaskLoad } from '@admin/tasks/model';

interface Props {
  load: readonly TaskLoad[];
  selectedUserId: number | null;
  onSelect: (userId: number | null) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

function LoadBar({ row }: { row: TaskLoad }) {
  if (row.open === 0) return <Box sx={{ height: 4, borderRadius: 2, bgcolor: 'action.hover' }} />;
  const part = (count: number) => `${(count / row.open) * 100}%`;
  const urgent = Math.min(row.urgent, row.open - row.overdue);
  const rest = row.open - row.overdue - urgent;
  return (
    <Box
      aria-hidden
      sx={{
        display: 'flex',
        height: 4,
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

/**
 * Workload of each manager (A2): open tasks, a bar (red overdue, orange urgent, blue the rest)
 * and what needs attention. A click filters the page by that manager; a second click clears it.
 */
export function TaskLoadList({ load, selectedUserId, onSelect }: Props) {
  if (load.length === 0) return null;
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Stack
        direction="row"
        sx={{ px: 2, pt: 1.5, pb: 0.5, justifyContent: 'space-between', alignItems: 'baseline' }}
      >
        <Typography variant="h6" component="h2">
          Навантаження менеджерів
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Натисніть, щоб показати завдання менеджера
        </Typography>
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        }}
      >
        {load.map((row) => {
          const selected = row.userId === selectedUserId;
          return (
            <ButtonBase
              key={row.userId}
              aria-pressed={selected}
              onClick={() => onSelect(selected ? null : row.userId)}
              sx={{
                display: 'block',
                textAlign: 'left',
                px: 2,
                py: 1.25,
                borderTop: 1,
                borderColor: 'divider',
                bgcolor: selected ? 'primary.light' : 'transparent',
                '&:hover': { bgcolor: selected ? 'primary.light' : 'action.hover' },
              }}
            >
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 0.75 }}>
                <UserAvatar name={row.name} size={24} />
                <Typography variant="subtitle2" noWrap sx={{ flex: 1, minWidth: 0 }}>
                  {row.name}
                </Typography>
                <Typography sx={{ ...mono, fontWeight: 600 }} aria-label={`Відкритих: ${row.open}`}>
                  {row.open}
                </Typography>
              </Stack>
              <LoadBar row={row} />
              <Stack direction="row" sx={{ gap: 1.5, mt: 0.75, minHeight: 18 }}>
                {row.overdue > 0 && (
                  <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 600 }}>
                    {row.overdue} простроч.
                  </Typography>
                )}
                {row.urgent > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    {row.urgent} термін.
                  </Typography>
                )}
                {row.open === 0 && (
                  <Typography variant="caption" color="text.secondary">
                    Немає відкритих завдань
                  </Typography>
                )}
              </Stack>
            </ButtonBase>
          );
        })}
      </Box>
    </Paper>
  );
}
