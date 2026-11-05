import { EmbroideryArchiveTable } from '@admin/embroidery/ui';
import { ReferenceEditorDrawer, ReferenceFormSection } from '@admin/references/ui';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Alert, Button, LinearProgress, Stack, Typography } from '@mui/material';
import { useRef } from 'react';

import { useEmbroideryArchiveImport } from '../../hooks/saved/use-embroidery-archive-import';

interface Props {
  onClose: () => void;
}

/** «Імпорт архіву»: choose the transfer file, see the check, then import. */
export function EmbroideryArchiveDrawer({ onClose }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const importer = useEmbroideryArchiveImport();
  return (
    <ReferenceEditorDrawer
      titleId="embroidery-archive-title"
      title="Імпорт архіву"
      description="Розрахунки старого калькулятора з’являться у «Збережених» зі своєю датою, автором і старими ставками. Ціни не перераховуються."
      formId="embroidery-archive-form"
      paperWidth={640}
      readOnly={importer.done}
      editLabel={null}
      saving={importer.busy}
      saveDisabled={!importer.canImport}
      submitLabel="Імпортувати"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={importer.apply}
    >
      <Stack sx={{ gap: 2 }}>
        <ReferenceFormSection title="Файл">
          <input
            ref={input}
            type="file"
            accept="application/json,.json"
            hidden
            aria-label="Файл архіву"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void importer.pick(file);
              event.target.value = '';
            }}
          />
          <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<UploadFileOutlinedIcon />}
              disabled={importer.busy || importer.done}
              onClick={() => input.current?.click()}
            >
              Обрати файл
            </Button>
            <Typography variant="body2" color="text.secondary">
              {importer.fileName ?? 'embroidery-archive.json'}
            </Typography>
          </Stack>
          {importer.busy && <LinearProgress />}
        </ReferenceFormSection>
        {importer.message && <Alert severity="error">{importer.message}</Alert>}
        {importer.result && <EmbroideryArchiveTable result={importer.result} />}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
