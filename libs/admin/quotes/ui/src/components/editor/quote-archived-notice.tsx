import { Alert, Button } from '@mui/material';

interface Props {
  archivedAt: string;
  archivedByName: string | null;
  busy: boolean;
  onRestore: () => void;
}

/** An archived КП opens read-only: say since when and offer to bring it back. */
export function QuoteArchivedNotice({ archivedAt, archivedByName, busy, onRestore }: Props) {
  const date = new Date(archivedAt).toLocaleDateString('uk-UA');
  return (
    <Alert
      severity="warning"
      sx={{ mb: 2 }}
      action={
        <Button color="inherit" onClick={onRestore} disabled={busy}>
          Повернути з архіву
        </Button>
      }
    >
      КП в архіві з {date}
      {archivedByName ? ` (${archivedByName})` : ''}. Щоб змінити або надіслати його, поверніть його
      з архіву.
    </Alert>
  );
}
