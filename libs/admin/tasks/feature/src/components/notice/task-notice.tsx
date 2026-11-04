import { Snackbar } from '@mui/material';

interface Props {
  message: string | null;
  onClose: () => void;
}

export function TaskNotice({ message, onClose }: Props) {
  return (
    <Snackbar
      open={message !== null}
      message={message}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
  );
}
