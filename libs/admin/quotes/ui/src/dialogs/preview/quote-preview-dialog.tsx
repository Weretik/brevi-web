import CloseIcon from '@mui/icons-material/Close';
import { Alert, Box, CircularProgress, Dialog, IconButton, Stack, Typography } from '@mui/material';
import { useRef } from 'react';

import { QuotePreviewSide } from './quote-preview-side';

import type { QuotePreviewWarning } from '@admin/quotes/model';

interface Props {
  open: boolean;
  number: string;
  /** The client and the number of items, under the title. */
  subtitle: string;
  /** Object URL of the PDF; null while it is being built. */
  pdfUrl: string | null;
  loading: boolean;
  error: string | null;
  warnings: readonly QuotePreviewWarning[];
  onClose: () => void;
  onSend: () => void;
  onDownload: () => void;
}

/**
 * «Перегляд КП» before sending (crm R-30): the PDF exactly as the client gets it, problems only, and the choice
 * to send it, download it or print it.
 */
export function QuotePreviewDialog({
  open,
  number,
  subtitle,
  pdfUrl,
  loading,
  error,
  warnings,
  onClose,
  onSend,
  onDownload,
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const ready = Boolean(pdfUrl) && !loading;

  return (
    <Dialog fullScreen open={open} onClose={onClose} aria-labelledby="quote-preview-title">
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          gap: 1.5,
          px: { xs: 1.5, md: 3 },
          py: 1.25,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <IconButton aria-label="Закрити перегляд" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <Box sx={{ minWidth: 0 }}>
          <Typography id="quote-preview-title" variant="h6" component="h2" noWrap>
            Перегляд КП № {number}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {subtitle}
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: { xs: 420, md: 0 },
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {loading && <CircularProgress aria-label="Формуємо PDF" />}
          {!loading && error && (
            <Alert severity="error" sx={{ mx: 2 }}>
              {error}
            </Alert>
          )}
          {ready && pdfUrl && (
            <Box
              component="iframe"
              ref={frame}
              src={pdfUrl}
              title={`PDF КП № ${number}`}
              sx={{ width: '100%', height: '100%', border: 0 }}
            />
          )}
        </Box>

        <QuotePreviewSide
          warnings={warnings}
          ready={ready}
          onSend={onSend}
          onDownload={onDownload}
          onPrint={() => frame.current?.contentWindow?.print()}
          onClose={onClose}
        />
      </Box>
    </Dialog>
  );
}
