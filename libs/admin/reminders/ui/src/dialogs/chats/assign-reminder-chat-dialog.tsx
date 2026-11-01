import {
  reminderChatName,
  reminderOrganizationLabels,
  reminderOrganizations,
} from '@admin/reminders/model';
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import type { ReminderChat, ReminderOrganization } from '@admin/reminders/model';

interface Props {
  chat: ReminderChat | null;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onAssign: (organizations: ReminderOrganization[]) => void;
}

export function AssignReminderChatDialog({ chat, saving, error, onClose, onAssign }: Props) {
  const [selected, setSelected] = useState<ReminderOrganization[]>([]);
  useEffect(() => setSelected([]), [chat]);
  const toggle = (code: ReminderOrganization, checked: boolean) =>
    setSelected((current) =>
      checked ? [...current, code] : current.filter((item) => item !== code),
    );
  return (
    <Dialog
      open={!!chat}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="assign-chat-title"
    >
      <DialogTitle id="assign-chat-title">Призначити чат задачам</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography variant="body2" sx={{ mb: 1 }}>
          Усі задачі вибраних організацій надсилатимуться в «{chat ? reminderChatName(chat) : ''}».
        </Typography>
        <FormGroup>
          {reminderOrganizations.map((code) => (
            <FormControlLabel
              key={code}
              label={reminderOrganizationLabels[code]}
              control={
                <Checkbox
                  checked={selected.includes(code)}
                  disabled={saving}
                  onChange={(event) => toggle(code, event.target.checked)}
                />
              }
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button disabled={saving} onClick={onClose}>
          Скасувати
        </Button>
        <Button
          variant="contained"
          disabled={saving || !selected.length}
          onClick={() => onAssign(selected)}
        >
          Призначити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
