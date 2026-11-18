import { productionOrderFilterLabels as fieldLabels } from '@admin/production/model';
import { MenuItem, Stack, TextField } from '@mui/material';

import { CodeFilterPicker } from './code-filter-picker';
import { TextFilterPicker } from './text-filter-picker';

import type {
  ProductionOrderFilterField,
  ProductionOrderFilterOptions,
  ProductionOrderFilterValues,
} from '@admin/production/model';

interface Props {
  values: ProductionOrderFilterValues;
  options: ProductionOrderFilterOptions | null;
  manager: string | null;
  /** Managers of the orders; the picker shows when there is more than one. */
  managers: readonly string[];
  onChange: (field: ProductionOrderFilterField, value: string | null) => void;
  onManagerChange: (manager: string | null) => void;
}

/** The fields of «Фільтри»: client, period, season, model, fabric, colour and manager. */
export function ProductionOrderFilterFields({
  values,
  options,
  manager,
  managers,
  onChange,
  onManagerChange,
}: Props) {
  const periodWrong = values.from && values.to && values.to < values.from;
  return (
    <>
      <TextFilterPicker
        label={fieldLabels.client}
        value={values.client}
        options={options?.clients ?? []}
        onChange={(value) => onChange('client', value)}
      />
      <Stack direction="row" spacing={1}>
        <TextField
          size="small"
          type="date"
          label={fieldLabels.from}
          value={values.from ?? ''}
          onChange={(event) => onChange('from', event.target.value || null)}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        />
        <TextField
          size="small"
          type="date"
          label={fieldLabels.to}
          value={values.to ?? ''}
          error={Boolean(periodWrong)}
          helperText={periodWrong ? 'Раніше за «від»' : undefined}
          onChange={(event) => onChange('to', event.target.value || null)}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        />
      </Stack>
      <TextField
        select
        size="small"
        label={fieldLabels.season}
        value={values.season ?? ''}
        onChange={(event) => onChange('season', event.target.value || null)}
      >
        <MenuItem value="">Усі</MenuItem>
        {(options?.seasons ?? []).map((season) => (
          <MenuItem key={season} value={season}>
            {season}
          </MenuItem>
        ))}
      </TextField>
      <CodeFilterPicker
        label={fieldLabels.model}
        value={values.model}
        options={options?.models ?? []}
        onChange={(value) => onChange('model', value)}
      />
      <CodeFilterPicker
        label={fieldLabels.fabric}
        value={values.fabric}
        options={options?.fabrics ?? []}
        onChange={(value) => onChange('fabric', value)}
      />
      <TextFilterPicker
        label={fieldLabels.color}
        value={values.color}
        options={options?.colors ?? []}
        onChange={(value) => onChange('color', value)}
      />
      {(managers.length > 1 || manager) && (
        <TextField
          select
          size="small"
          label="Менеджер"
          value={manager ?? ''}
          onChange={(event) => onManagerChange(event.target.value || null)}
        >
          <MenuItem value="">Усі</MenuItem>
          {managers.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </TextField>
      )}
    </>
  );
}
