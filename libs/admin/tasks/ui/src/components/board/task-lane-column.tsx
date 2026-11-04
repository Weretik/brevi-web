import { Box, Stack, Typography } from '@mui/material';

import type { TaskLane } from '@admin/tasks/model';
import type { DragEvent, ReactNode } from 'react';

const laneColor: Record<TaskLane, string> = {
  Overdue: 'error.main',
  Urgent: 'primary.main',
  Active: 'info.main',
  Done: 'success.main',
};

interface Props {
  lane: TaskLane;
  label: string;
  count: number;
  /** True while a dragged card may be dropped here. */
  accepts: boolean;
  /** Text inside the empty column. */
  emptyText: string;
  children: ReactNode;
  onDrop: () => void;
}

/** One kanban column on `action.hover` with a colored dot, the name and a count. */
export function TaskLaneColumn({
  lane,
  label,
  count,
  accepts,
  emptyText,
  children,
  onDrop,
}: Props) {
  const allow = (event: DragEvent) => {
    if (!accepts) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };
  return (
    <Box
      component="section"
      aria-label={`${label}: ${count}`}
      onDragOver={allow}
      onDragEnter={allow}
      onDrop={(event) => {
        if (!accepts) return;
        event.preventDefault();
        onDrop();
      }}
      sx={{
        bgcolor: 'action.hover',
        border: 1,
        borderColor: accepts ? 'primary.main' : 'divider',
        borderStyle: accepts ? 'dashed' : 'solid',
        borderRadius: 2,
        p: 1.25,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        minHeight: 160,
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1, px: 0.25 }}>
        <Box
          aria-hidden
          sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: laneColor[lane] }}
        />
        <Typography variant="subtitle2" component="h2" sx={{ fontWeight: 700 }}>
          {label}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ ml: 'auto', fontFamily: 'var(--admin-font-mono)' }}
        >
          {count}
        </Typography>
      </Stack>
      {count === 0 ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ border: 1, borderStyle: 'dashed', borderColor: 'divider', borderRadius: 2, p: 1.5 }}
        >
          {emptyText}
        </Typography>
      ) : (
        children
      )}
    </Box>
  );
}
