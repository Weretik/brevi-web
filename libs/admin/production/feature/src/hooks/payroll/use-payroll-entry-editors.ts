import {
  useCreatePayrollAdjustmentMutation,
  useCreatePayrollPaymentMutation,
} from '@admin/production/data-access';
import {
  createPayrollAdjustmentValues,
  createPayrollPaymentValues,
  payrollAdjustmentBody,
  payrollPaymentBody,
  todayIso,
  validatePayrollAdjustment,
  validatePayrollPayment,
} from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  PayrollAdjustmentErrors,
  PayrollAdjustmentFormValues,
  PayrollPaymentErrors,
  PayrollPaymentFormValues,
} from '@admin/production/model';

/** «Додати виплату» of a month. */
export function usePayrollPaymentEditor(month: string, onSaved: (message: string) => void) {
  const today = todayIso();
  const [values, setValues] = useState(() => createPayrollPaymentValues(today));
  const [errors, setErrors] = useState<PayrollPaymentErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [create, state] = useCreatePayrollPaymentMutation();

  async function save() {
    if (state.isLoading) return;
    const validation = validatePayrollPayment(values, today);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    try {
      await create({ month, body: payrollPaymentBody(values) }).unwrap();
      onSaved('Виплату додано.');
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося додати виплату.'));
    }
  }

  return {
    today,
    values,
    errors,
    message,
    saving: state.isLoading,
    save,
    change: (next: PayrollPaymentFormValues) => {
      setValues(next);
      setErrors({});
    },
  };
}

/** «Інше нарахування / утримання» of a month. */
export function usePayrollAdjustmentEditor(month: string, onSaved: (message: string) => void) {
  const [values, setValues] = useState(() => createPayrollAdjustmentValues());
  const [errors, setErrors] = useState<PayrollAdjustmentErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [create, state] = useCreatePayrollAdjustmentMutation();

  async function save() {
    if (state.isLoading) return;
    const validation = validatePayrollAdjustment(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    try {
      await create({ month, body: payrollAdjustmentBody(values) }).unwrap();
      onSaved(values.sign === 'deduction' ? 'Утримання додано.' : 'Нарахування додано.');
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти запис.'));
    }
  }

  return {
    values,
    errors,
    message,
    saving: state.isLoading,
    save,
    change: (next: PayrollAdjustmentFormValues) => {
      setValues(next);
      setErrors({});
    },
  };
}
