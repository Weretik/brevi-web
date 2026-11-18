import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useRef } from 'react';

import { productCopy } from './old-site-import-copy';
import { OldSiteImportSummary } from './old-site-import-summary';
import { OldSiteImportSwitches } from './old-site-import-switches';

import type { OldSiteImportCopy } from './old-site-import-copy';
import type { OldSiteImportOptions, OldSiteImportReport } from '@admin/content/model';

interface Props {
  open: boolean;
  copy?: OldSiteImportCopy;
  /** Products the transfer adds to categories; shown only by the category transfer. */
  productLinks?: number | null;
  /** Pictures the transfer brings into «Фото»; shown only by the article transfer. */
  photos?: number | null;
  /** How far a transfer sent in parts has got, in words. */
  progress?: string | null;
  fileName: string | null;
  options: OldSiteImportOptions;
  report: OldSiteImportReport | null;
  message: string | null;
  running: 'check' | 'transfer' | null;
  canTransfer: boolean;
  onPick: (file: File) => void;
  onOptions: (options: OldSiteImportOptions) => void;
  onTransfer: () => void;
  onClose: () => void;
}

/**
 * One-time transfer of old-site texts and SEO: pick the file → the server says what would happen →
 * «Перенести». Nothing is written before «Перенести».
 */
export function OldSiteImportDialog({
  open,
  copy = productCopy,
  productLinks = null,
  photos = null,
  progress = null,
  fileName,
  options,
  report,
  message,
  running,
  canTransfer,
  onPick,
  onOptions,
  onTransfer,
  onClose,
}: Props) {
  const input = useRef<HTMLInputElement>(null);
  const busy = running !== null;
  const done = Boolean(report && !report.dryRun);
  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="old-site-import-title"
    >
      <DialogTitle id="old-site-import-title">{copy.title}</DialogTitle>
      {busy && <LinearProgress aria-label="Триває перенесення" />}
      <DialogContent>
        <Stack sx={{ gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {copy.intro}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <input
              ref={input}
              type="file"
              accept="application/json,.json"
              hidden
              aria-label="Файл перенесення"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = '';
                if (file) onPick(file);
              }}
            />
            <Button variant="outlined" disabled={busy} onClick={() => input.current?.click()}>
              {fileName ? 'Обрати інший файл' : 'Обрати файл'}
            </Button>
            {fileName && <Typography variant="body2">{fileName}</Typography>}
          </Box>
          {!done && (
            <OldSiteImportSwitches
              copy={copy}
              options={options}
              busy={busy}
              onOptions={onOptions}
            />
          )}
          {progress && (
            <Typography variant="body2" role="status">
              {progress}
            </Typography>
          )}
          {message && <Alert severity="error">{message}</Alert>}
          {report && (
            <OldSiteImportSummary
              copy={copy}
              report={report}
              done={done}
              productLinks={productLinks}
              photos={photos}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={busy} onClick={onClose}>
          {done ? 'Закрити' : 'Скасувати'}
        </Button>
        {!done && (
          <Button variant="contained" disabled={busy || !canTransfer} onClick={onTransfer}>
            Перенести
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export type { OldSiteImportCopy } from './old-site-import-copy';
