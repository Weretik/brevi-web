import { Alert, Button, FormControlLabel, Paper, Stack, Switch, TextField } from '@mui/material';

import { FinanceJournalCategoryFilters } from './finance-journal-category-filters';
import { FinanceJournalPeriodFields } from './finance-journal-period-fields';

import type { FinanceJournalFilter } from '@admin/accounting/model';

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
  /** The search and the type are in the quick bar above, so the panel leaves them out. */
  quick?: boolean;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** Journal filters («Ще фільтри»); the table changes only on «Застосувати». */
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
  quick = false,
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
        <FinanceJournalPeriodFields value={value} accounts={accounts} onChange={onChange} />
        {kind === 'transactions' && (
          <FinanceJournalCategoryFilters
            value={value}
            roots={roots}
            children={children}
            quick={quick}
            onChange={onChange}
          />
        )}
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          {!quick && (
            <TextField
              label={kind === 'transactions' ? 'Опис, примітка або контрагент' : 'Примітка'}
              value={value.search}
              onChange={(event) => set('search', event.target.value)}
              fullWidth
            />
          )}
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
