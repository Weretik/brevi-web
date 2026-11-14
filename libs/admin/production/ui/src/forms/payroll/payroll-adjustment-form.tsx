import { PAYROLL_REASON_MAX_LENGTH } from '@admin/production/model';
import { Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';

import { PayrollEmployeePicker } from './payroll-employee-picker';

import type { PayrollPersonOption } from './payroll-setup-form';
import type { PayrollAdjustmentErrors, PayrollAdjustmentFormValues } from '@admin/production/model';

interface AdjustmentProps {
  values: PayrollAdjustmentFormValues;
  errors: PayrollAdjustmentErrors;
  people: readonly PayrollPersonOption[];
  disabled: boolean;
  onChange: (values: PayrollAdjustmentFormValues) => void;
}

/** «Інше нарахування / утримання» with a reason. */
export function PayrollAdjustmentForm({
  values,
  errors,
  people,
  disabled,
  onChange,
}: AdjustmentProps) {
  return (
    <Stack sx={{ gap: 2 }}>
      <PayrollEmployeePicker
        people={people}
        value={values.employeeId}
        error={errors.employeeId}
        disabled={disabled}
        onChange={(employeeId) => onChange({ ...values, employeeId })}
      />
      <ToggleButtonGroup
        exclusive
        size="small"
        value={values.sign}
        disabled={disabled}
        onChange={(_event, sign) => sign && onChange({ ...values, sign })}
      >
        <ToggleButton value="accrual">Нарахування</ToggleButton>
        <ToggleButton value="deduction">Утримання</ToggleButton>
      </ToggleButtonGroup>
      <TextField
        label="Сума, грн"
        required
        value={values.amount}
        disabled={disabled}
        error={!!errors.amount}
        helperText={errors.amount}
        onChange={(event) => onChange({ ...values, amount: event.target.value })}
        slotProps={{ htmlInput: { inputMode: 'decimal' } }}
      />
      <TextField
        label="Причина"
        required
        multiline
        minRows={2}
        value={values.reason}
        disabled={disabled}
        error={!!errors.reason}
        helperText={errors.reason}
        onChange={(event) => onChange({ ...values, reason: event.target.value })}
        slotProps={{ htmlInput: { maxLength: PAYROLL_REASON_MAX_LENGTH } }}
      />
    </Stack>
  );
}
