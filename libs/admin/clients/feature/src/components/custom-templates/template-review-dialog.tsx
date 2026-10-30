import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

import type { CustomTemplateDetail } from '@admin/clients/model';

export function TemplateReviewDialog({
  value,
  open,
  disabled,
  onCancel,
  onApply,
}: {
  value: CustomTemplateDetail;
  open: boolean;
  disabled: boolean;
  onCancel: () => void;
  onApply: () => void;
}) {
  return (
    <Dialog open={open} onClose={disabled ? undefined : onCancel} fullWidth maxWidth="sm">
      <DialogTitle>Перегляд шаблону перед застосуванням</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>
            {value.selections.name} · версія №{value.versionNumber}
          </Typography>
          <Typography>
            {value.selections.productType} ·{' '}
            {value.selections.season === 'winter' ? 'Зима' : 'Літо'}
          </Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{value.selections.description}</Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{value.introduction}</Typography>
          <Typography>
            Тканин: {value.selections.fabrics.length}; фурнітури:{' '}
            {value.selections.accessories.length}; операцій: {value.selections.operations.length};
            нанесень: {value.selections.applications.length}.
          </Typography>
          {(['fabrics', 'accessories'] as const).map((kind) => (
            <Stack key={kind}>
              <Typography sx={{ fontWeight: 'bold' }}>
                {kind === 'fabrics' ? 'Тканини' : 'Фурнітура'}
              </Typography>
              {value.selections[kind].map((row, index) => (
                <Typography key={index}>
                  Довідник №{row.referenceId}: {row.quantity} {row.unit}
                </Typography>
              ))}
            </Stack>
          ))}
          {value.selections.operations.map((row, index) => (
            <Typography key={`operation-${index}`}>
              Операція №{row.referenceId}: {row.quantity}; хвилини:{' '}
              {row.manualMinutes ?? 'за довідником'}
            </Typography>
          ))}
          {value.selections.applications.map((row, index) => (
            <Typography key={`application-${index}`}>
              {row.kind === 'print' ? 'Друк' : 'Вишивка'}: {row.location}
            </Typography>
          ))}
          <Alert severity="info">
            Буде створено нову приватну конфігурацію. Поточна конфігурація не зміниться. Ціни,
            приватні примітки та файли не копіюються. Нанесення потребують нового погодження, а ціни
            — нового серверного розрахунку.
          </Alert>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={disabled} onClick={onCancel}>
          Скасувати
        </Button>
        <Button disabled={disabled || value.archived} onClick={onApply}>
          Створити нову конфігурацію із шаблону
        </Button>
      </DialogActions>
    </Dialog>
  );
}
