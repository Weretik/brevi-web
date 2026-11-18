import {
  categoryDirectionLabels,
  categoryDirections,
  financeReportHasType,
} from '@admin/accounting/model';
import { Alert, Button, MenuItem, Paper, Stack, TextField } from '@mui/material';

import { FinanceReportPeriodFields } from './finance-report-period-fields';
import { FinanceCounterpartyPicker } from '../counterparties/finance-counterparty-picker';

import type { FinanceCounterpartySearch } from '../transactions/finance-counterparty-fields';
import type { CategoryDirection, FinanceReportFilter } from '@admin/accounting/model';

interface Choice {
  id: string;
  name: string;
}

interface Props {
  value: FinanceReportFilter;
  accounts: Choice[];
  /** Roots of the chosen area and type. */
  roots: Choice[];
  counterparties: Omit<FinanceCounterpartySearch, 'onCreate'>;
  problem: string | null;
  building: boolean;
  onChange: (next: FinanceReportFilter) => void;
  onApply: () => void;
}

/** «Звіти»: the kind, the period and narrowing fields; the report changes only on «Сформувати звіт». */
export function FinanceReportForm({
  value,
  accounts,
  roots,
  counterparties,
  problem,
  building,
  onChange,
  onApply,
}: Props) {
  const set = <Key extends keyof FinanceReportFilter>(key: Key, next: FinanceReportFilter[Key]) =>
    onChange({ ...value, [key]: next });
  const hasType = financeReportHasType(value.kind);
  const categoryReady = Boolean(value.scope) && (!hasType || Boolean(value.type));

  return (
    <Paper
      component="form"
      variant="outlined"
      aria-label="Параметри звіту"
      onSubmit={(event) => {
        event.preventDefault();
        onApply();
      }}
      sx={{ p: 2 }}
    >
      <Stack sx={{ gap: 2 }}>
        <FinanceReportPeriodFields value={value} onChange={onChange} />
        <Stack direction={{ xs: 'column', md: 'row' }} sx={{ gap: 2 }}>
          <TextField
            select
            label="Рахунок"
            value={value.accountId}
            onChange={(event) => set('accountId', event.target.value)}
            sx={{ flex: 1, minWidth: 0 }}
          >
            <MenuItem value="">Усі рахунки</MenuItem>
            {accounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.name}
              </MenuItem>
            ))}
          </TextField>
          {hasType && (
            <TextField
              select
              label="Тип"
              value={value.type}
              onChange={(event) =>
                onChange({
                  ...value,
                  type: event.target.value as CategoryDirection | '',
                  categoryId: '',
                })
              }
              sx={{ flex: 1, minWidth: 0 }}
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
            disabled={!categoryReady}
            helperText={
              categoryReady
                ? undefined
                : hasType
                  ? 'Спершу оберіть облік і тип'
                  : 'Спершу оберіть облік'
            }
            onChange={(event) => set('categoryId', event.target.value)}
            sx={{ flex: 1, minWidth: 0 }}
          >
            <MenuItem value="">Усі категорії</MenuItem>
            {roots.map((root) => (
              <MenuItem key={root.id} value={root.id}>
                {root.name}
              </MenuItem>
            ))}
          </TextField>
          <Stack sx={{ flex: 1.4, minWidth: 0 }}>
            <FinanceCounterpartyPicker
              value={value.counterparty}
              options={counterparties.options}
              loading={counterparties.loading}
              disabled={counterparties.disabled}
              onSearch={counterparties.onSearch}
              onChange={(choice) => set('counterparty', choice)}
              compact={false}
            />
          </Stack>
        </Stack>
        {problem && <Alert severity="error">{problem}</Alert>}
        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" disabled={building}>
            Сформувати звіт
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
