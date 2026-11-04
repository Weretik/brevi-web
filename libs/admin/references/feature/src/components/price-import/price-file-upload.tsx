import { priceFileAccept, priceFileLabel } from '@admin/references/model';
import { PriceImportPreview, ReferenceFormSection } from '@admin/references/ui';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Alert, Button, CircularProgress, Stack, Typography } from '@mui/material';

import { usePriceFileImport } from '../../hooks/price-import/use-price-file-import';

import type { PriceImportResult, PriceSource } from '@admin/references/model';

interface Props {
  source: PriceSource;
  onApplied: (result: PriceImportResult) => void;
}

/** «Оновити з файлу»: choose the supplier's files, see what changes, then apply. */
export function PriceFileUpload({ source, onApplied }: Props) {
  const upload = usePriceFileImport(source, onApplied);
  const ready = upload.files.length === source.fileCount;

  return (
    <ReferenceFormSection title="Оновити з файлу">
      <Typography variant="body2" color="text.secondary">
        Додайте {priceFileLabel(source.fileKind, source.fileCount)}. Спочатку покажемо, які ціни
        зміняться; записуємо лише після «Застосувати».
      </Typography>
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button
          component="label"
          variant="outlined"
          startIcon={<UploadFileOutlinedIcon />}
          disabled={upload.sending}
        >
          Обрати файли
          <input
            hidden
            type="file"
            multiple={source.fileCount > 1}
            accept={priceFileAccept(source.fileKind)}
            aria-label={`Файли прайсу ${source.title}`}
            onChange={(event) => {
              upload.choose(Array.from(event.target.files ?? []));
              event.target.value = '';
            }}
          />
        </Button>
        <Typography variant="body2" sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
          {upload.files.map((file) => file.name).join(', ') || 'Файли не обрано'}
        </Typography>
      </Stack>
      {upload.fileCountError && <Alert severity="error">{upload.fileCountError}</Alert>}
      {upload.message && <Alert severity="error">{upload.message}</Alert>}
      {upload.preview && (
        <PriceImportPreview result={upload.preview} showTiers={source.fileKind === 'InsightYml'} />
      )}
      <Stack direction="row" sx={{ gap: 1, justifyContent: 'flex-end' }}>
        <Button
          variant={upload.preview ? 'outlined' : 'contained'}
          disabled={!ready || upload.sending}
          onClick={() => void upload.check()}
        >
          {upload.sending && !upload.preview && (
            <CircularProgress color="inherit" size={18} sx={{ mr: 1 }} />
          )}
          Перевірити
        </Button>
        {upload.preview && (
          <Button
            variant="contained"
            disabled={upload.preview.changed === 0 || upload.sending}
            onClick={() => void upload.apply()}
          >
            {upload.sending && <CircularProgress color="inherit" size={18} sx={{ mr: 1 }} />}
            Застосувати ({upload.preview.changed})
          </Button>
        )}
      </Stack>
    </ReferenceFormSection>
  );
}
