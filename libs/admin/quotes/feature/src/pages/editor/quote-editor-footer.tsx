import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Button, Paper, Typography } from '@mui/material';

interface Props {
  dirty: boolean;
  saving: boolean;
  generating: boolean;
  /** An archived КП: nothing is saved or sent until it is restored. */
  locked?: boolean;
  onClose: () => void;
  onSave: () => void;
  onPdf: () => void;
  onSend: () => void;
}

/** Sticky editor footer: «Закрити», «Зберегти зміни», «Сформувати КП» and the main «Надіслати КП». */
export function QuoteEditorFooter({
  dirty,
  saving,
  generating,
  locked = false,
  onClose,
  onSave,
  onPdf,
  onSend,
}: Props) {
  const busy = saving || generating;
  return (
    <Paper
      variant="outlined"
      sx={{
        position: 'sticky',
        bottom: 16,
        mt: 3,
        p: 1.5,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 1,
      }}
    >
      {dirty && (
        <Typography variant="body2" color="text.secondary" sx={{ mr: 'auto' }}>
          Є незбережені зміни
        </Typography>
      )}
      <Button onClick={onClose}>Закрити</Button>
      <Button onClick={onSave} disabled={busy || locked}>
        {saving && !generating ? 'Зберігаємо…' : 'Зберегти зміни'}
      </Button>
      <Button
        variant="outlined"
        startIcon={<PictureAsPdfOutlinedIcon />}
        onClick={onPdf}
        disabled={busy}
      >
        {generating ? 'Формуємо…' : 'Сформувати КП'}
      </Button>
      <Button
        variant="contained"
        startIcon={<SendOutlinedIcon />}
        disabled={busy || locked}
        onClick={onSend}
      >
        Надіслати КП
      </Button>
    </Paper>
  );
}
