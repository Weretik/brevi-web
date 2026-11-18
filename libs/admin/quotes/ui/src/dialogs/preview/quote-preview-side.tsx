import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Alert, AlertTitle, Box, Button, Stack, Typography } from '@mui/material';

import type { QuotePreviewWarning } from '@admin/quotes/model';

interface Props {
  warnings: readonly QuotePreviewWarning[];
  /** The PDF is built: it can be sent, downloaded or printed. */
  ready: boolean;
  onSend: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onClose: () => void;
}

/** The right column of «Перегляд КП»: problems, «Надіслати КП», download, print and back to editing. */
export function QuotePreviewSide({ warnings, ready, onSend, onDownload, onPrint, onClose }: Props) {
  return (
    <Stack
      sx={{
        width: { xs: '100%', md: 380 },
        flex: 'none',
        p: { xs: 2, md: 3 },
        gap: 2,
        borderLeft: { md: 1 },
        borderTop: { xs: 1, md: 0 },
        borderColor: 'divider',
        overflowY: 'auto',
      }}
    >
      {warnings.map((warning) => (
        <Alert key={warning.key} severity="warning">
          <AlertTitle>{warning.title}</AlertTitle>
          {warning.text}
        </Alert>
      ))}
      <Typography variant="body2" color="text.secondary">
        Так клієнт побачить КП. Можна надіслати його листом, завантажити або роздрукувати.
      </Typography>
      <Box sx={{ flex: 1 }} />
      <Button
        variant="contained"
        size="large"
        startIcon={<SendOutlinedIcon />}
        disabled={!ready}
        onClick={onSend}
      >
        Надіслати КП
      </Button>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<DownloadOutlinedIcon />}
          disabled={!ready}
          onClick={onDownload}
        >
          Завантажити
        </Button>
        <Button
          variant="outlined"
          startIcon={<PrintOutlinedIcon />}
          disabled={!ready}
          onClick={onPrint}
        >
          Друкувати
        </Button>
      </Box>
      <Button onClick={onClose}>Повернутися до редагування</Button>
    </Stack>
  );
}
