import { minorToInput, parseMoneyToMinor } from '../../mappers/money/finance-money';

import type {
  FinanceTransfer,
  FinanceTransferBody,
} from '../../entities/transfers/finance-transfer';
import type { FinanceTransferFormValues } from '../../validators/transfers/finance-transfer-validation';

export function createFinanceTransferFormValues(
  transfer: FinanceTransfer | null,
  date: string,
): FinanceTransferFormValues {
  return {
    date: transfer?.date ?? date,
    fromAccountId: transfer?.fromAccountId ?? '',
    toAccountId: transfer?.toAccountId ?? '',
    amount: transfer ? minorToInput(transfer.amountMinor) : '',
    note: transfer?.note ?? '',
  };
}

/** Request fields; call only after validation passed. */
export function financeTransferBody(values: FinanceTransferFormValues): FinanceTransferBody {
  return {
    date: values.date,
    fromAccountId: values.fromAccountId,
    toAccountId: values.toAccountId,
    amountMinor: parseMoneyToMinor(values.amount) ?? 0,
    note: values.note.trim() || null,
  };
}
