import { Alert, Snackbar } from '@mui/material';

export interface ReminderNotice {
  tone: 'success' | 'error';
  text: string;
}

interface Props {
  notice: ReminderNotice | null;
  onClose: () => void;
}

export function ReminderNoticeSnackbar({ notice, onClose }: Props) {
  return (
    <Snackbar
      open={!!notice}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      {notice ? (
        <Alert severity={notice.tone} onClose={onClose} variant="standard">
          {notice.text}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
}
