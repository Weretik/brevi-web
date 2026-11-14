import {
  PAYROLL_COMMENT_MAX_LENGTH,
  payrollPaymentKindLabels,
  payrollPaymentKinds,
} from '@admin/production/model';
import { MenuItem, Stack, TextField } from '@mui/material';

import { PayrollEmployeePicker } from './payroll-employee-picker';

import type { PayrollPersonOption } from './payroll-setup-form';
import type {
  PayrollPaymentErrors,
  PayrollPaymentFormValues,
  PayrollPaymentKind,
} from '@admin/production/model';

interface PaymentProps {
  values: PayrollPaymentFormValues;
  errors: PayrollPaymentErrors;
  people: readonly PayrollPersonOption[];
  today: string;
  disabled: boolean;
  onChange: (values: PayrollPaymentFormValues) => void;
}

/** «Виплата»: who, when, how and how much. */
export function PayrollPaymentForm({
  values,
  errors,
  people,
  today,
  disabled,
  onChange,
}: PaymentProps) {
  return (
    <Stack sx={{ gap: 2 }}>
      <PayrollEmployeePicker
        people={people}
        value={values.employeeId}
        error={errors.employeeId}
        disabled={disabled}
        onChange={(employeeId) => onChange({ ...values, employeeId })}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
        <TextField
          type="date"
          label="Дата виплати"
          required
          value={values.paidOn}
          disabled={disabled}
          error={!!errors.paidOn}
          helperText={errors.paidOn}
          onChange={(event) => onChange({ ...values, paidOn: event.target.value })}
          slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: today } }}
        />
        <TextField
          select
          label="Вид"
          value={values.kind}
          disabled={disabled}
          sx={{ minWidth: 160 }}
          onChange={(event) =>
            onChange({ ...values, kind: event.target.value as PayrollPaymentKind })
          }
        >
          {payrollPaymentKinds.map((kind) => (
            <MenuItem key={kind} value={kind}>
              {payrollPaymentKindLabels[kind]}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
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
        label="Коментар"
        multiline
        minRows={2}
        value={values.comment}
        disabled={disabled}
        error={!!errors.comment}
        helperText={errors.comment}
        onChange={(event) => onChange({ ...values, comment: event.target.value })}
        slotProps={{ htmlInput: { maxLength: PAYROLL_COMMENT_MAX_LENGTH } }}
      />
    </Stack>
  );
}
