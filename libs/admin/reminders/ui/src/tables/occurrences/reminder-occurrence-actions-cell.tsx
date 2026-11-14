import { usePageRights } from '@admin/shared/ui';
import HistoryIcon from '@mui/icons-material/History';
import { Button, IconButton, Stack, Tooltip } from '@mui/material';

import type { ReminderOccurrence } from '@admin/reminders/model';

interface Props {
  occurrence: ReminderOccurrence;
  busy: boolean;
  onClose: (occurrence: ReminderOccurrence) => void;
  onReopen: (occurrence: ReminderOccurrence) => void;
  onHistory: (occurrence: ReminderOccurrence) => void;
}

export function ReminderOccurrenceActionsCell({
  occurrence,
  busy,
  onClose,
  onReopen,
  onHistory,
}: Props) {
  const done = occurrence.status === 'done';
  const { canEdit } = usePageRights();
  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      {canEdit && (
        <Button
          size="small"
          variant="outlined"
          disabled={busy}
          onClick={() => (done ? onReopen(occurrence) : onClose(occurrence))}
        >
          {done ? 'Відкрити' : 'Виконано'}
        </Button>
      )}
      <Tooltip title="Історія">
        <IconButton
          size="small"
          aria-label={`Історія «${occurrence.taskTitle}», ${occurrence.period}`}
          onClick={() => onHistory(occurrence)}
        >
          <HistoryIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
