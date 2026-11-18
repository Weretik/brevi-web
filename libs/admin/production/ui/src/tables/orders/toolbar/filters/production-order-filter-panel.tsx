import { countProductionOrderFilters } from '@admin/production/model';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material';

import { ProductionOrderFilterFields } from './production-order-filter-fields';

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
          <ProductionOrderFilterFields
            values={values}
            options={options}
            manager={manager}
            managers={managers}
            onChange={onChange}
            onManagerChange={onManagerChange}
          />
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
