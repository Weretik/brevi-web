import { categoryDirectionLabels, categoryDirections } from '@admin/accounting/model';
import {
  Alert,
  Button,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
} from '@mui/material';

import type { CategoryDirection, FinanceJournalFilter } from '@admin/accounting/model';

interface Choice {
  id: string;
  name: string;
}

interface Props {
  value: FinanceJournalFilter;
  /** Operations add type and category filters; transfers do not. */
  kind: 'transactions' | 'transfers';
  accounts: Choice[];
  /** Roots of the chosen type (operations only). */
  roots?: Choice[];
  /** Subcategories of the chosen root (operations only). */
  children?: Choice[];
  problem: string | null;
  onChange: (next: FinanceJournalFilter) => void;
  onApply: () => void;
  onReset: () => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** Journal filters; the table changes only on «Застосувати». */
export function FinanceJournalFilters({
  value,
  kind,
  accounts,
  roots = [],
  children = [],
  problem,
  onChange,
  onApply,
  onReset,
}: Props) {
  const set = <Key extends keyof FinanceJournalFilter>(key: Key, next: FinanceJournalFilter[Key]) =>
    onChange({ ...value, [key]: next });
  return (
    <Paper
      component="form"
      variant="outlined"
      aria-label="Фільтри журналу"
      onSubmit={(event) => {
        event.preventDefault();
        onApply();
      }}
      sx={{ p: 2, mb: 2 }}
    >
      <Stack sx={{ gap: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          <TextField
            label="Від"
            type="date"
            value={value.from}
            onChange={(event) => set('from', event.target.value)}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { style: mono } }}
            fullWidth
          />
          <TextField
            label="До"
            type="date"
            value={value.to}
            onChange={(event) => set('to', event.target.value)}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { style: mono } }}
            fullWidth
          />
          <TextField
            select
            label="Рахунок"
            value={value.accountId}
            onChange={(event) => set('accountId', event.target.value)}
            fullWidth
          >
            <MenuItem value="">Усі рахунки</MenuItem>
            {accounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        {kind === 'transactions' && (
          <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
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
            <TextField
              select
              label="Категорія"
              value={value.categoryId}
              disabled={!value.type}
              helperText={value.type ? undefined : 'Спершу оберіть тип'}
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
        )}
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          <TextField
            label={kind === 'transactions' ? 'Опис, примітка або контрагент' : 'Примітка'}
            value={value.search}
            onChange={(event) => set('search', event.target.value)}
            fullWidth
          />
          <TextField
            label="Сума від, грн"
            value={value.min}
            onChange={(event) => set('min', event.target.value)}
            slotProps={{
              htmlInput: { inputMode: 'decimal', style: { ...mono, textAlign: 'right' } },
            }}
            fullWidth
          />
          <TextField
            label="Сума до, грн"
            value={value.max}
            onChange={(event) => set('max', event.target.value)}
            slotProps={{
              htmlInput: { inputMode: 'decimal', style: { ...mono, textAlign: 'right' } },
            }}
            fullWidth
          />
        </Stack>
        {problem && <Alert severity="warning">{problem}</Alert>}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ gap: 1, alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={value.includeVoided}
                onChange={(event) => set('includeVoided', event.target.checked)}
              />
            }
            label="Показати анульовані"
          />
          <Stack direction="row" sx={{ gap: 1 }}>
            <Button onClick={onReset}>Скинути</Button>
            <Button type="submit" variant="contained" disabled={Boolean(problem)}>
              Застосувати
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
