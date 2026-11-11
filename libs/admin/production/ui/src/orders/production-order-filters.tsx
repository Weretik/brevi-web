import { productionStageLabels } from '@admin/production/model';
import CloseIcon from '@mui/icons-material/Close';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type {
  ProductionFilterOption,
  ProductionOrderFilterField,
  ProductionOrderFilterOptions,
  ProductionOrderFilterValues,
  ProductionStage,
} from '@admin/production/model';

const fieldLabels: Record<ProductionOrderFilterField, string> = {
  client: 'Замовник',
  from: 'Період від',
  to: 'Період до',
  model: 'Модель',
  fabric: 'Тканина',
  color: 'Колір',
  season: 'Сезон',
};

const formatDate = (value: string) => value.split('-').reverse().join('.');

function optionLabel(list: ProductionFilterOption[] | undefined, code: string) {
  const option = list?.find((x) => x.code === code);
  return option && option.name !== option.code ? `${option.code} · ${option.name}` : code;
}

/** How many of the panel's filters are set: the seven fields and the manager. */
export function countProductionOrderFilters(
  values: ProductionOrderFilterValues,
  manager: string | null,
) {
  return (
    (Object.keys(fieldLabels) as ProductionOrderFilterField[]).filter((x) => values[x]).length +
    (manager ? 1 : 0)
  );
}

function TextPicker({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | null;
  options: string[];
  onChange: (value: string | null) => void;
}) {
  return (
    <Autocomplete
      size="small"
      options={options}
      value={value}
      onChange={(_event, next) => onChange(next)}
      renderInput={(params) => <TextField {...params} label={label} />}
      noOptionsText="Немає збігів"
    />
  );
}

function CodePicker({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | null;
  options: ProductionFilterOption[];
  onChange: (value: string | null) => void;
}) {
  const selected = options.find((x) => x.code === value) ?? null;
  return (
    <Autocomplete
      size="small"
      options={options}
      value={selected}
      getOptionLabel={(option) => `${option.code} · ${option.name}`}
      isOptionEqualToValue={(option, current) => option.code === current.code}
      onChange={(_event, next) => onChange(next?.code ?? null)}
      renderInput={(params) => <TextField {...params} label={label} />}
      noOptionsText="Немає збігів"
    />
  );
}

interface PanelProps {
  open: boolean;
  values: ProductionOrderFilterValues;
  options: ProductionOrderFilterOptions | null;
  manager: string | null;
  /** Managers of the orders; the picker shows when there is more than one. */
  managers: readonly string[];
  /** Orders that match now, shown on «Показати». */
  count: number;
  onChange: (field: ProductionOrderFilterField, value: string | null) => void;
  onManagerChange: (manager: string | null) => void;
  onReset: () => void;
  onClose: () => void;
}

/**
 * «Фільтри» of «Виробничі завдання» in a side panel: client, period, season, model, fabric, colour and manager.
 * Each change applies at once; the list behind shows the result.
 */
export function ProductionOrderFilterPanel({
  open,
  values,
  options,
  manager,
  managers,
  count,
  onChange,
  onManagerChange,
  onReset,
  onClose,
}: PanelProps) {
  const periodWrong = values.from && values.to && values.to < values.from;
  const active = countProductionOrderFilters(values, manager);
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          role: 'dialog',
          'aria-labelledby': 'production-order-filters-title',
          sx: { width: { xs: '100%', sm: 420 }, maxWidth: '100vw', bgcolor: 'background.default' },
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
        <Stack
          direction="row"
          sx={{ alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, px: 3, py: 2.5 }}
        >
          <Box>
            <Typography id="production-order-filters-title" component="h2" variant="h6">
              Фільтри
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Діють на список і на «Зведення за моделями».
            </Typography>
          </Box>
          <IconButton aria-label="Закрити фільтри" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />
        <Stack sx={{ gap: 2, px: 3, py: 2.5, overflowY: 'auto', flex: 1 }}>
          <TextPicker
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
          <CodePicker
            label={fieldLabels.model}
            value={values.model}
            options={options?.models ?? []}
            onChange={(value) => onChange('model', value)}
          />
          <CodePicker
            label={fieldLabels.fabric}
            value={values.fabric}
            options={options?.fabrics ?? []}
            onChange={(value) => onChange('fabric', value)}
          />
          <TextPicker
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
        </Stack>
        <Divider />
        <Stack direction="row" sx={{ gap: 1, px: 3, py: 2, justifyContent: 'flex-end' }}>
          <Button disabled={active === 0} onClick={onReset}>
            Скинути
          </Button>
          <Button variant="contained" onClick={onClose}>
            Показати {count}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}

interface ChipsProps {
  values: ProductionOrderFilterValues;
  options: ProductionOrderFilterOptions | null;
  manager: string | null;
  stage: ProductionStage | null;
  onChange: (field: ProductionOrderFilterField, value: string | null) => void;
  onManagerChange: (manager: string | null) => void;
  onStageChange: (stage: ProductionStage | null) => void;
}

/** The set filters as chips next to the status chips; × removes one filter. */
export function ProductionOrderFilterChips({
  values,
  options,
  manager,
  stage,
  onChange,
  onManagerChange,
  onStageChange,
}: ChipsProps) {
  const set = (Object.keys(fieldLabels) as ProductionOrderFilterField[]).filter((x) => values[x]);
  const chipText = (field: ProductionOrderFilterField, value: string) => {
    if (field === 'from' || field === 'to') return `${fieldLabels[field]}: ${formatDate(value)}`;
    if (field === 'model') return `Модель: ${optionLabel(options?.models, value)}`;
    if (field === 'fabric') return `Тканина: ${optionLabel(options?.fabrics, value)}`;
    return `${fieldLabels[field]}: ${value}`;
  };
  const sx = { height: 32, bgcolor: 'primary.light', color: 'primary.dark', fontWeight: 600 };
  return (
    <>
      {stage && (
        <Chip
          sx={sx}
          label={`Етап: ${productionStageLabels[stage]}`}
          onDelete={() => onStageChange(null)}
        />
      )}
      {set.map((field) => (
        <Chip
          key={field}
          sx={sx}
          label={chipText(field, values[field] ?? '')}
          onDelete={() => onChange(field, null)}
        />
      ))}
      {manager && (
        <Chip sx={sx} label={`Менеджер: ${manager}`} onDelete={() => onManagerChange(null)} />
      )}
    </>
  );
}
