import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Box, Button, Paper, Typography } from '@mui/material';

interface Props {
  /** `card`: the right column on wide screens; `bar`: a sticky bar at the bottom. */
  layout: 'card' | 'bar';
  dirty: boolean;
  saving: boolean;
  generating: boolean;
  /** An archived КП: nothing is saved or sent until it is restored. */
  locked?: boolean;
  onSave: () => void;
  onPdf: () => void;
  onSend: () => void;
}

/** The КП actions in one place: the main «Надіслати КП», then «Переглянути PDF» and «Зберегти». */
export function QuoteSendActions({
  layout,
  dirty,
  saving,
  generating,
  locked = false,
  onSave,
  onPdf,
  onSend,
}: Props) {
  const busy = saving || generating;
  const card = layout === 'card';
  const send = (
    <Button
      variant="contained"
      startIcon={<SendOutlinedIcon />}
      disabled={busy || locked}
      onClick={onSend}
      fullWidth={card}
    >
      Надіслати КП
    </Button>
  );
  const pdf = (
    <Button
      variant="outlined"
      startIcon={<PictureAsPdfOutlinedIcon />}
      onClick={onPdf}
      disabled={busy}
    >
      {generating ? 'Формуємо…' : 'Переглянути PDF'}
    </Button>
  );
  const save = (
    <Button variant="outlined" onClick={onSave} disabled={busy || locked}>
      {saving && !generating ? 'Зберігаємо…' : 'Зберегти'}
    </Button>
  );
  const status = dirty && (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ textAlign: card ? 'center' : 'left' }}
    >
      Є незбережені зміни
    </Typography>
  );

  if (card)
    return (
      <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {send}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          {pdf}
          {save}
        </Box>
        {status}
      </Paper>
    );
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
      <Box sx={{ mr: 'auto' }}>{status}</Box>
      {save}
      {pdf}
      {send}
    </Paper>
  );
}
