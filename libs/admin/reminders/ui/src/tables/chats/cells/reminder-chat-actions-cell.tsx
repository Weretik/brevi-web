import { Button, Stack } from '@mui/material';

import type { ReminderChat } from '@admin/reminders/model';

interface Props {
  chat: ReminderChat;
  busy: boolean;
  onEdit: (chat: ReminderChat) => void;
  onTest: (chat: ReminderChat) => void;
  onAssign: (chat: ReminderChat) => void;
}

export function ReminderChatActionsCell({ chat, busy, onEdit, onTest, onAssign }: Props) {
  return (
    <Stack direction="row" spacing={0.5}>
      <Button
        size="small"
        variant={chat.isApproved ? 'text' : 'outlined'}
        onClick={() => onEdit(chat)}
      >
        {chat.isApproved ? 'Налаштувати' : 'Підтвердити'}
      </Button>
      <Button size="small" disabled={busy || !chat.isBotMember} onClick={() => onTest(chat)}>
        Тест
      </Button>
      <Button size="small" disabled={!chat.isApproved} onClick={() => onAssign(chat)}>
        Призначити задачам
      </Button>
    </Stack>
  );
}
