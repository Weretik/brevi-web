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
import type { SewingMaterialDraft, SewingMaterialKind } from '@admin/products/model';

const unitLabel = { Metre: 'м', Piece: 'шт.', Service: 'послуга', Kilogram: 'кг' } as const;
interface Props {
  scope: 'Model' | 'Article';
  material: SewingMaterialDraft;
  error: (field: string) => string | undefined;
  lookups: Pick<ProductLookups, 'fabrics' | 'accessories'>;
  readonly: boolean;
  canManage: boolean;
  saving: boolean;
  onChange: (update: Partial<SewingMaterialDraft>) => void;
  onRemove: () => void;
}
export function SewingMaterialRow({
  scope,
  material,
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
      <Typography component="h4">
        {scope === 'Model' ? 'Спільний матеріал' : 'Матеріал артикулу'}
      </Typography>
      <TextField
        select
        label="Тип матеріалу"
        value={material.kind}
        onChange={(event) => {
          const kind = event.target.value as SewingMaterialKind;
          onChange({
            ...material,
            kind,
            referenceId: null,
            costCode: null,
            unit: kind === 'Fabric' ? 'Metre' : kind === 'Accessory' ? 'Piece' : 'Service',
          });
        }}
        disabled={readonly}
      >
        <MenuItem value="Fabric">Тканина</MenuItem>
        <MenuItem value="Accessory">Фурнітура</MenuItem>
        <MenuItem value="OtherCost">Інша витрата</MenuItem>
      </TextField>
      {material.kind === 'Fabric' && (
        <TextField
          select
          label="Тканина"
          value={material.referenceId ?? ''}
          onChange={(event) => onChange({ referenceId: Number(event.target.value) || null })}
          error={Boolean(error('referenceId'))}
          helperText={error('referenceId')}
          disabled={readonly}
        >
          <MenuItem value="">Оберіть тканину</MenuItem>
          {material.referenceId &&
            !lookups.fabrics.some((item) => item.id === material.referenceId) && (
              <MenuItem value={material.referenceId}>
                Недоступна тканина · ID {material.referenceId}
              </MenuItem>
            )}
          {lookups.fabrics.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>
      )}
      {material.kind === 'Accessory' && (
        <TextField
          select
          label="Фурнітура"
          value={material.referenceId ?? ''}
          onChange={(event) => onChange({ referenceId: Number(event.target.value) || null })}
          error={Boolean(error('referenceId'))}
          helperText={error('referenceId')}
          disabled={readonly}
        >
          <MenuItem value="">Оберіть фурнітуру</MenuItem>
          {material.referenceId &&
            !lookups.accessories.some((item) => item.id === material.referenceId) && (
              <MenuItem value={material.referenceId}>
                Недоступна фурнітура · ID {material.referenceId}
              </MenuItem>
            )}
          {lookups.accessories.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>
      )}
      {material.kind === 'OtherCost' && (
        <TextField
          label="Код іншої витрати"
          value={material.costCode ?? ''}
          onChange={(event) => onChange({ costCode: event.target.value || null })}
          error={Boolean(error('costCode'))}
          helperText={error('costCode') ?? 'Не є складським матеріалом.'}
          slotProps={{ htmlInput: { maxLength: 80 } }}
          disabled={readonly}
        />
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1 }}>
        <TextField
          label="Кількість"
          type="number"
          value={material.quantity}
          onChange={(event) =>
            onChange({ quantity: event.target.value === '' ? 0 : Number(event.target.value) })
          }
          error={Boolean(error('quantity'))}
          helperText={error('quantity')}
          slotProps={{ htmlInput: { min: 0, step: 'any' } }}
          disabled={readonly}
        />
        <TextField label="Одиниця" value={unitLabel[material.unit]} disabled />
        <FormControlLabel
          control={
            <Checkbox
              checked={material.required}
              onChange={(_, checked) => onChange({ required: checked })}
              disabled={readonly}
            />
          }
          label="Обов’язковий"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={material.reviewed}
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
