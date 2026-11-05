import {
  useClosePayrollMonthMutation,
  useReopenPayrollMonthMutation,
  useSetPayrollIssuedMutation,
  useVoidPayrollAdjustmentMutation,
  useVoidPayrollPaymentMutation,
} from '@admin/production/data-access';
import { formatWorkMonth, parseIssued } from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import { useStockReason } from '../stock/use-stock-reason';

import type {
  PayrollAdjustment,
  PayrollLine,
  PayrollMonth,
  PayrollPayment,
} from '@admin/production/model';

export type PayrollCancel =
  { kind: 'payment'; row: PayrollPayment } | { kind: 'adjustment'; row: PayrollAdjustment };

/** What Admin does with a month: «Видано», cancelling payments and adjustments, closing and reopening. */
export function usePayrollMonthActions(month: PayrollMonth, onMessage: (message: string) => void) {
  const label = formatWorkMonth(month.month);
  const [confirm, setConfirm] = useState<'close' | 'reopen' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [setIssued, issued] = useSetPayrollIssuedMutation();
  const [voidPayment] = useVoidPayrollPaymentMutation();
  const [voidAdjustment] = useVoidPayrollAdjustmentMutation();
  const [close, closing] = useClosePayrollMonthMutation();
  const [reopen, reopening] = useReopenPayrollMonthMutation();
  const cancel = useStockReason<PayrollCancel>(
    (target, reason) =>
      target.kind === 'payment'
        ? voidPayment({ id: target.row.id, reason }).unwrap()
        : voidAdjustment({ id: target.row.id, reason }).unwrap(),
    () => onMessage('Скасовано.'),
    'Не вдалося скасувати запис.',
  );

  async function saveIssued(line: PayrollLine, raw: string) {
    const parsed = parseIssued(raw);
    if (!parsed) {
      setError('«Видано»: сума від 0 до 10 000 000 грн, до двох знаків після коми.');
      return false;
    }
    setError(null);
    try {
      await setIssued({
        month: month.month,
        body: { employeeId: line.employeeId, amount: parsed.amount },
      }).unwrap();
      onMessage(`«Видано» збережено: ${line.name}.`);
      return true;
    } catch (failure) {
      setError(adminApiErrorMessage(failure, 'Не вдалося зберегти «Видано».'));
      return false;
    }
  }

  async function confirmed() {
    setError(null);
    try {
      if (confirm === 'close') await close(month.month).unwrap();
      else await reopen(month.month).unwrap();
      onMessage(confirm === 'close' ? `${label}: місяць закрито.` : `${label}: місяць відкрито.`);
    } catch (failure) {
      setError(adminApiErrorMessage(failure, 'Не вдалося змінити місяць.'));
    } finally {
      setConfirm(null);
    }
  }

  return {
    cancel,
    confirm,
    setConfirm,
    error,
    setError,
    saveIssued,
    confirmed,
    savingIssued: issued.isLoading,
    changingMonth: closing.isLoading || reopening.isLoading,
  };
}
