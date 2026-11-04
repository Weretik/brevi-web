import {
  embroideryBasisLabels,
  formatEmbroideryMoney,
  isEmbroideryExpenseTicked,
} from '@admin/embroidery/model';
import { Box, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';

import { EmbroideryFormCard } from '../embroidery-form-card';
import { EmbroideryNumberField } from '../embroidery-number-field';

import type {
  EmbroideryCalculationErrors,
  EmbroideryCalculationValues,
  EmbroideryCostRow,
  EmbroideryFormExpense,
} from '@admin/embroidery/model';

interface Props {
  values: EmbroideryCalculationValues;
  /** Costs of the chosen mode, in «Налаштування» order. */
  expenses: readonly EmbroideryFormExpense[];
  /** Cost rows of the last calculation; empty for a Manager. */
  rows: readonly EmbroideryCostRow[];
  needsMachineTime: boolean;
  errors: EmbroideryCalculationErrors;
  onTick: (expense: EmbroideryFormExpense, ticked: boolean) => void;
  onChange: (patch: Partial<EmbroideryCalculationValues>) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** «4 · Додаткові витрати»: what is ticked by default can be unticked for this calculation only. */
export function EmbroideryExpensesSection({
  values,
  expenses,
  rows,
  needsMachineTime,
  errors,
  onTick,
  onChange,
}: Props) {
  const amounts = new Map(
    rows.filter((row) => row.kind === 'Extra').map((row) => [row.name, row.amount]),
  );
  const ticked = expenses.filter((expense) => isEmbroideryExpenseTicked(values, expense));
  const total = ticked.reduce((sum, expense) => sum + (amounts.get(expense.name) ?? 0), 0);

  return (
    <EmbroideryFormCard
      title="4 · Додаткові витрати"
      aside={
        <Typography variant="body2" color="text.secondary" sx={mono}>
          {ticked.length} з {expenses.length}
          {rows.length > 0 && ` · ${formatEmbroideryMoney(total)} грн`}
        </Typography>
      }
    >
      {expenses.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Додаткових витрат немає.
        </Typography>
      ) : (
        <Stack divider={<Box sx={{ borderTop: 1, borderColor: 'divider' }} />}>
          {expenses.map((expense) => {
            const on = isEmbroideryExpenseTicked(values, expense);
            const amount = on ? amounts.get(expense.name) : undefined;
            return (
              <Stack
                key={expense.id}
                direction="row"
                sx={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                  minHeight: 44,
                }}
              >
                <FormControlLabel
                  sx={{ mr: 0, minWidth: 0 }}
                  control={
                    <Checkbox
                      size="small"
                      checked={on}
                      onChange={(event) => onTick(expense, event.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" component="span">
                        {expense.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" component="span">
                        {' · '}
                        {embroideryBasisLabels[expense.basis]}
                      </Typography>
                      {!expense.hasRate && on && (
                        <Typography variant="caption" color="warning.main" component="span">
                          {' · ставку не задано'}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                {amount !== undefined && (
                  <Typography variant="body2" sx={{ ...mono, whiteSpace: 'nowrap' }}>
                    {formatEmbroideryMoney(amount)}
                  </Typography>
                )}
              </Stack>
            );
          })}
        </Stack>
      )}
      {needsMachineTime && (
        <EmbroideryNumberField
          label="Час роботи машини на всю партію"
          unit="хв"
          value={values.machineMinutes}
          error={errors.machineMinutes}
          helperText="Потрібно для витрат «за годину машини»."
          onChange={(machineMinutes) => onChange({ machineMinutes })}
          sx={{ maxWidth: 320 }}
        />
      )}
    </EmbroideryFormCard>
  );
}
