import { ReferenceEditorDrawer, ReferenceFormSection } from '@admin/references/ui';
import { StockTransferSummary } from '@admin/warehouse/ui';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRef } from 'react';

import { useStockTransfer } from '../../hooks/transfer/use-stock-transfer';

interface Props {
  onClose: () => void;
}

/**
 * «Перенесення з v133»: the JSONL files of the old «Цех» export are checked first; the transfer
 * then replaces the whole «Склад тканин».
 */
export function StockTransferDrawer({ onClose }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const transfer = useStockTransfer();
  return (
    <ReferenceEditorDrawer
      titleId="stock-transfer-title"
      title="Перенесення з v133"
      description="Замінює весь склад тканин залишками, рухами й видачами старого «Цеху». Спершу вигрузка перевіряється, нічого не змінюючи."
      formId="stock-transfer-form"
      paperWidth={720}
      readOnly={transfer.done}
      editLabel={null}
      saving={transfer.busy}
      saveDisabled={!transfer.canApply}
      submitLabel="Перенести"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={transfer.apply}
    >
      <Stack sx={{ gap: 2 }}>
        <ReferenceFormSection title="Вигрузка">
          <Typography variant="body2" color="text.secondary">
            Спершу перенесіть завдання цеху («Виробничі завдання → Імпорт» та «Імпорт етапів»).
            Потім виберіть усі файли .jsonl з папки d1 вигрузки.
          </Typography>
          <TextField
            label="Назва вигрузки"
            helperText="Для журналу перенесень, наприклад «v133 від 11.11»"
            value={transfer.snapshot}
            disabled={transfer.done}
            slotProps={{ htmlInput: { maxLength: 200 } }}
            onChange={(event) => transfer.setSnapshot(event.target.value)}
          />
          <input
            ref={input}
            type="file"
            accept=".jsonl"
            multiple
            hidden
            aria-label="Файли вигрузки"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              if (files.length > 0) void transfer.pick(files);
              event.target.value = '';
            }}
          />
          <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<UploadFileOutlinedIcon />}
              disabled={transfer.busy || transfer.done}
              onClick={() => input.current?.click()}
            >
              Вибрати файли
            </Button>
            {transfer.fileCount > 0 && (
              <Typography variant="body2" color="text.secondary">
                Вибрано файлів: {transfer.fileCount}
              </Typography>
            )}
          </Stack>
          {transfer.busy && <LinearProgress />}
        </ReferenceFormSection>
        {transfer.message && <Alert severity="error">{transfer.message}</Alert>}
        {transfer.result && <StockTransferSummary result={transfer.result} />}
        {transfer.needsConfirmation && (
          <FormControlLabel
            control={
              <Checkbox
                checked={transfer.confirm}
                onChange={(event) => transfer.setConfirm(event.target.checked)}
              />
            }
            label="Видалити внесене в Brevi вручну й перенести склад зі старого «Цеху»"
          />
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
