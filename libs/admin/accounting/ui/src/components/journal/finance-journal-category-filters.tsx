import { categoryDirectionLabels, categoryDirections } from '@admin/accounting/model';
import { MenuItem, Stack, TextField } from '@mui/material';

import type { CategoryDirection, FinanceJournalFilter } from '@admin/accounting/model';

interface Choice {
  id: string;
  name: string;
}

/** Type, category and subcategory of the operations filters; a new type or category clears what is below it. */
export function FinanceJournalCategoryFilters({
  value,
  roots,
  children,
  quick,
  onChange,
}: {
  value: FinanceJournalFilter;
  roots: Choice[];
  children: Choice[];
  quick: boolean;
  onChange: (next: FinanceJournalFilter) => void;
}) {
  const set = <Key extends keyof FinanceJournalFilter>(key: Key, next: FinanceJournalFilter[Key]) =>
    onChange({ ...value, [key]: next });
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
      {!quick && (
        <TextField
          select
          label="Тип"
          value={value.type}
          onChange={(event) =>
            onChange({
              ...value,
              type: event.target.value as CategoryDirection | '',
              categoryId: '',
              subcategoryId: '',
            })
          }
          fullWidth
        >
          <MenuItem value="">Доходи й витрати</MenuItem>
          {categoryDirections.map((direction) => (
            <MenuItem key={direction} value={direction}>
              {categoryDirectionLabels[direction]}
            </MenuItem>
          ))}
        </TextField>
      )}
      <TextField
        select
        label="Категорія"
        value={value.categoryId}
        disabled={!value.type}
        helperText={
          value.type
            ? undefined
            : quick
              ? 'Спершу оберіть «Надходження» або «Витрати»'
              : 'Спершу оберіть тип'
        }
        onChange={(event) =>
          onChange({ ...value, categoryId: event.target.value, subcategoryId: '' })
        }
        fullWidth
      >
        <MenuItem value="">Усі категорії</MenuItem>
        {roots.map((root) => (
          <MenuItem key={root.id} value={root.id}>
            {root.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Підкатегорія"
        value={value.subcategoryId}
        disabled={!value.categoryId || !children.length}
        onChange={(event) => set('subcategoryId', event.target.value)}
        fullWidth
      >
        <MenuItem value="">Усі підкатегорії</MenuItem>
        {children.map((child) => (
          <MenuItem key={child.id} value={child.id}>
            {child.name}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}
