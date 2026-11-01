import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import { ReminderOccurrenceHistory } from '../../details/occurrences/reminder-occurrence-history';

import type { ReminderOccurrence } from '@admin/reminders/model';

interface Props {
  occurrence: ReminderOccurrence | null;
  onClose: () => void;
}

export function ReminderOccurrenceHistoryDialog({ occurrence, onClose }: Props) {
  return (
    <Dialog
      open={!!occurrence}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="reminder-history-title"
    >
      <DialogTitle id="reminder-history-title">Історія періоду</DialogTitle>
      <DialogContent>
        {occurrence && (
          <>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {occurrence.taskTitle} · {occurrence.period}
            </Typography>
            <ReminderOccurrenceHistory actions={occurrence.actions} />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрити</Button>
      </DialogActions>
    </Dialog>
  );
}
