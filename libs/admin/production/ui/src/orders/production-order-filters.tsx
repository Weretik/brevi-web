import { activeProductionOrderFilters } from '@admin/production/model';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TuneIcon from '@mui/icons-material/Tune';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Collapse,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type {
  ProductionFilterOption,
  ProductionOrderFilterField,
  ProductionOrderFilterOptions,
  ProductionOrderFilterValues,
} from '@admin/production/model';

interface Props {
  values: ProductionOrderFilterValues;
  options: ProductionOrderFilterOptions | null;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  onChange: (field: ProductionOrderFilterField, value: string | null) => void;
  onReset: () => void;
}

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

/**
 * «Фільтри» of «Виробничі завдання»: client, order period, model, fabric, colour and season.
 * Collapsed, it keeps the set filters visible as chips that remove one filter each.
 */
export function ProductionOrderFilters({
  values,
  options,
  expanded,
  onExpandedChange,
  onChange,
  onReset,
}: Props) {
  const active = activeProductionOrderFilters(values);
  const set = (Object.keys(fieldLabels) as ProductionOrderFilterField[]).filter((x) => values[x]);
  const chipText = (field: ProductionOrderFilterField, value: string) => {
    if (field === 'from' || field === 'to') return `${fieldLabels[field]}: ${formatDate(value)}`;
    if (field === 'model') return `Модель: ${optionLabel(options?.models, value)}`;
    if (field === 'fabric') return `Тканина: ${optionLabel(options?.fabrics, value)}`;
    return `${fieldLabels[field]}: ${value}`;
  };
  const periodWrong = values.from && values.to && values.to < values.from;

  return (
    <Paper variant="outlined" sx={{ px: 2, py: 1.25, mb: 1.5 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}>
        <TuneIcon fontSize="small" color="action" />
        <Typography variant="subtitle2">Фільтри</Typography>
        {!expanded &&
          set.map((field) => (
            <Chip
              key={field}
              size="small"
              label={chipText(field, values[field] ?? '')}
              onDelete={() => onChange(field, null)}
            />
          ))}
        <Box sx={{ flexGrow: 1 }} />
        {active > 0 && (
          <Button size="small" onClick={onReset}>
            Скинути ({active})
          </Button>
        )}
        <Button
          size="small"
          aria-expanded={expanded}
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={() => onExpandedChange(!expanded)}
        >
          {expanded ? 'Згорнути' : 'Розгорнути'}
        </Button>
      </Stack>
      <Collapse in={expanded} unmountOnExit>
        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            pt: 1.5,
            pb: 0.5,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          }}
        >
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
        </Box>
      </Collapse>
    </Paper>
  );
}
