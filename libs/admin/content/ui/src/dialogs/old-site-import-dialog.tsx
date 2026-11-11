import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  LinearProgress,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useRef } from 'react';

import type {
  OldSiteImportNote,
  OldSiteImportOptions,
  OldSiteImportReport,
} from '@admin/content/model';

/** Words of the dialog; the defaults are those of the product transfer. */
export interface OldSiteImportCopy {
  title: string;
  intro: string;
  showOnSite: string;
  overwrite: string;
  done: string;
  /** «Сторінок у файлі» */
  total: string;
  notMatched: string;
}

const productCopy: OldSiteImportCopy = {
  title: 'Перенести тексти зі старого сайту',
  intro:
    'Файл перенесення містить назви, SEO, опис і характеристики товарів старого сайту двома мовами. Сторінка знаходить свій товар за посиланням старого сайту з картки товару. Спершу показуємо, що буде зроблено; нічого не зберігається, доки не натиснути «Перенести».',
  showOnSite: 'Одразу показувати перенесені товари на сайті',
  overwrite: 'Замінити тексти сторінок, які вже заповнені',
  done: 'Тексти перенесено.',
  total: 'Сторінок у файлі',
  notMatched: 'Не знайдено товар у «Товари»',
};

interface Props {
  open: boolean;
  copy?: OldSiteImportCopy;
  /** Products the transfer adds to categories; shown only by the category transfer. */
  productLinks?: number | null;
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

function Notes({ title, notes }: { title: string; notes: OldSiteImportNote[] }) {
  if (notes.length === 0) return null;
  return (
    <Alert severity="warning">
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {title}: {notes.length}
      </Typography>
      <Box component="ul" aria-label={title} sx={{ m: 0, mt: 0.5, pl: 2.5 }}>
        {notes.map((note) => (
          <li key={note.url}>
            <Typography variant="body2">
              {note.name ?? note.url}: {note.reason}
            </Typography>
          </li>
        ))}
      </Box>
    </Alert>
  );
}

/**
 * One-time transfer of old-site texts and SEO: pick the file → the server says what would happen →
 * «Перенести». Nothing is written before «Перенести».
 */
export function OldSiteImportDialog({
  open,
  copy = productCopy,
  productLinks = null,
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
            <Stack>
              <FormControlLabel
                control={
                  <Switch
                    checked={options.showOnSite}
                    disabled={busy}
                    onChange={(_event, showOnSite) => onOptions({ ...options, showOnSite })}
                  />
                }
                label={copy.showOnSite}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={options.overwrite}
                    disabled={busy}
                    onChange={(_event, overwrite) => onOptions({ ...options, overwrite })}
                  />
                }
                label={copy.overwrite}
              />
            </Stack>
          )}
          {message && <Alert severity="error">{message}</Alert>}
          {report && (
            <Stack sx={{ gap: 1.5 }}>
              {done && <Alert severity="success">{copy.done}</Alert>}
              <Typography variant="body2" role="status">
                {copy.total}: {report.total} · {done ? 'Створено' : 'Буде створено'}:{' '}
                {report.created} · {done ? 'Замінено' : 'Буде замінено'}: {report.updated} ·
                Залишено без змін: {report.kept}
                {productLinks !== null &&
                  ` · ${done ? 'Додано товарів у розділи' : 'Буде додано товарів у розділи'}: ${productLinks}`}
              </Typography>
              <Notes title={copy.notMatched} notes={report.notMatched} />
              <Notes title="Не вдалося перенести" notes={report.problems} />
            </Stack>
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
