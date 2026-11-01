import { reminderChatNameMaxLength } from '@admin/reminders/model';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

import type { ReminderChat, ReminderChatInput } from '@admin/reminders/model';

interface Props {
  chat: ReminderChat | null;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSave: (input: ReminderChatInput) => void;
}

export function ReminderChatDialog({ chat, saving, error, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [approved, setApproved] = useState(true);
  useEffect(() => {
    setName(chat?.displayName ?? '');
    // Opening the dialog is how a new chat gets approved, so the switch starts on.
    setApproved(true);
  }, [chat]);
  return (
    <Dialog
      open={!!chat}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="reminder-chat-title"
    >
      <DialogTitle id="reminder-chat-title">Чат «{chat?.telegramTitle}»</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Назва в адмінці"
            value={name}
            disabled={saving}
            placeholder={chat?.telegramTitle}
            helperText="Порожньо — як у Telegram"
            slotProps={{ htmlInput: { maxLength: reminderChatNameMaxLength } }}
            onChange={(event) => setName(event.target.value)}
          />
          <FormControlLabel
            control={
              <Switch
                checked={approved}
                disabled={saving}
                onChange={(event) => setApproved(event.target.checked)}
              />
            }
            label="Надсилати нагадування в цей чат"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={saving} onClick={onClose}>
          Скасувати
        </Button>
        <Button
          variant="contained"
          disabled={saving}
          onClick={() => onSave({ displayName: name.trim() || null, isApproved: approved })}
        >
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
}
