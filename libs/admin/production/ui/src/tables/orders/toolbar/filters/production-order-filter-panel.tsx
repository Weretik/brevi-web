import {
  countProductionOrderFilters,
  productionOrderFilterLabels as fieldLabels,
} from '@admin/production/model';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { CodeFilterPicker } from './code-filter-picker';
import { TextFilterPicker } from './text-filter-picker';

import type {
  ProductionOrderFilterField,
  ProductionOrderFilterOptions,
  ProductionOrderFilterValues,
} from '@admin/production/model';

interface Props {
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
}: Props) {
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
