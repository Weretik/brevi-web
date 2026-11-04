import { ProductionImportPreview } from '@admin/production/ui';
import { ReferenceEditorDrawer, ReferenceFormSection } from '@admin/references/ui';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Alert, Button, LinearProgress, Stack, Typography } from '@mui/material';
import { useRef } from 'react';

import { useProductionImport } from '../../hooks/import/use-production-import';

import type { ImportFileResult, ProductionImportResult } from '@admin/production/model';

interface Props<Row> {
  title: string;
  description: string;
  keyLabel: string;
  detailLabel: string;
  parse: (text: string) => ImportFileResult<Row>;
  send: (rows: Row[], dryRun: boolean) => Promise<ProductionImportResult>;
  onClose: () => void;
}

/** Choose the transfer file, check it on the server, then save. */
export function ProductionImportDrawer<Row>({
  title,
  description,
  keyLabel,
  detailLabel,
  parse,
  send,
  onClose,
}: Props<Row>) {
  const input = useRef<HTMLInputElement>(null);
  const importer = useProductionImport(parse, send);
  return (
    <ReferenceEditorDrawer
      titleId="production-import-title"
      title={title}
      description={description}
      formId="production-import-form"
      paperWidth={640}
      readOnly={importer.done}
      editLabel={null}
      saving={importer.busy}
      saveDisabled={!importer.canApply}
      submitLabel="Зберегти"
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
            aria-label="Файл перенесення"
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
              {importer.fileName ?? 'JSON з папки перенесення'}
            </Typography>
          </Stack>
          {importer.busy && <LinearProgress />}
        </ReferenceFormSection>
        {importer.message && <Alert severity="error">{importer.message}</Alert>}
        {importer.done && <Alert severity="success">Збережено.</Alert>}
        {importer.preview && (
          <ProductionImportPreview
            result={importer.preview}
            keyLabel={keyLabel}
            detailLabel={detailLabel}
          />
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
