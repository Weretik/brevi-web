import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

import { DueDatePreviewList } from '../../components/schedule/due-date-preview-list';
import { ReminderTaskForm } from '../../forms/tasks/reminder-task-form';

import type {
  DueDatePreview,
  ReminderChat,
  ReminderTaskFormErrors,
  ReminderTaskFormValues,
} from '@admin/reminders/model';

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  values: ReminderTaskFormValues;
  errors: ReminderTaskFormErrors;
  chats: readonly ReminderChat[];
  previews: readonly DueDatePreview[];
  previewLoading: boolean;
  saving: boolean;
  saveError: string | null;
  onChange: (patch: Partial<ReminderTaskFormValues>) => void;
  onClose: () => void;
  onSave: () => void;
}

export function ReminderTaskDialog(props: Props) {
  const { open, mode, saving, saveError, onClose, onSave } = props;
  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="reminder-task-dialog-title"
    >
      <DialogTitle id="reminder-task-dialog-title">
        {mode === 'create' ? 'Нова задача' : 'Редагування задачі'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {saveError && <Alert severity="error">{saveError}</Alert>}
          <ReminderTaskForm
            values={props.values}
            errors={props.errors}
            chats={props.chats}
            disabled={saving}
            onChange={props.onChange}
          />
          <Divider />
          <Typography variant="h6" component="h2">
            Найближчі терміни
          </Typography>
          <DueDatePreviewList previews={props.previews} loading={props.previewLoading} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={saving} onClick={onClose}>
          Скасувати
        </Button>
        <Button variant="contained" disabled={saving} onClick={onSave}>
          {mode === 'create' ? 'Створити' : 'Зберегти'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
