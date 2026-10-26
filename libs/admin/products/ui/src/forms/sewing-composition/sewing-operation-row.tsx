import {
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { ProductLookups } from '../../product-editor/core/product-lookups';
import type { SewingOperationDraft } from '@admin/products/model';

interface Props {
  operation: SewingOperationDraft;
  error: (field: string) => string | undefined;
  lookups: Pick<ProductLookups, 'operations'>;
  readonly: boolean;
  canManage: boolean;
  saving: boolean;
  onChange: (update: Partial<SewingOperationDraft>) => void;
  onRemove: () => void;
}
export function SewingOperationRow({
  operation,
  error,
  lookups,
  readonly,
  canManage,
  saving,
  onChange,
  onRemove,
}: Props) {
  return (
    <Stack sx={{ p: 2, gap: 1, border: 1, borderColor: 'divider', borderRadius: 1 }}>
      <TextField
        select
        label="Операція"
        value={operation.operationId || ''}
        onChange={(event) => onChange({ operationId: Number(event.target.value) || 0 })}
        error={Boolean(error('operationId'))}
        helperText={error('operationId')}
        disabled={readonly}
      >
        <MenuItem value="">Оберіть операцію</MenuItem>
        {operation.operationId &&
          !lookups.operations.some((item) => item.id === operation.operationId) && (
            <MenuItem value={operation.operationId}>
              Недоступна операція · ID {operation.operationId}
            </MenuItem>
          )}
        {lookups.operations.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </TextField>
      <Typography color="text.secondary">
        {lookups.operations.find((item) => item.id === operation.operationId)
          ? `Нормативний час: ${lookups.operations.find((item) => item.id === operation.operationId)?.min} хв`
          : 'Нормативний час недоступний у довіднику.'}
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1 }}>
        <TextField
          label="Кількість"
          type="number"
          value={operation.quantity}
          onChange={(event) =>
            onChange({ quantity: event.target.value === '' ? 0 : Number(event.target.value) })
          }
          error={Boolean(error('quantity'))}
          helperText={error('quantity')}
          slotProps={{ htmlInput: { min: 0, step: 'any' } }}
          disabled={readonly}
        />
        <TextField
          label="Ручний час, хв"
          type="number"
          value={operation.manualMinutes ?? ''}
          onChange={(event) =>
            onChange({
              manualMinutes: event.target.value === '' ? null : Number(event.target.value),
            })
          }
          error={Boolean(error('manualMinutes'))}
          helperText={error('manualMinutes')}
          slotProps={{ htmlInput: { min: 0, step: 'any' } }}
          disabled={readonly}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={operation.reviewed}
              onChange={(_, checked) => onChange({ reviewed: checked })}
              disabled={readonly}
            />
          }
          label="Перевірено"
        />
        {canManage && (
          <Button color="error" onClick={onRemove} disabled={saving}>
            Видалити
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
