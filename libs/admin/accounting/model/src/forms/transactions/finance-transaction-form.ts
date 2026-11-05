import { minorToInput, parseMoneyToMinor } from '../../mappers/money/finance-money';

import type {
  CategoryDirection,
  FinanceCategory,
} from '../../entities/categories/finance-category';
import type {
  FinanceTransaction,
  FinanceTransactionBody,
} from '../../entities/transactions/finance-transaction';
import type { FinanceTransactionFormValues } from '../../validators/transactions/finance-transaction-validation';

/** Form of a new operation (`transaction` null) or of an existing one. */
export function createFinanceTransactionFormValues(
  transaction: FinanceTransaction | null,
  type: CategoryDirection,
  date: string,
): FinanceTransactionFormValues {
  const isChild = Boolean(transaction?.subcategoryName);
  return {
    date: transaction?.date ?? date,
    type: transaction?.type ?? type,
    accountId: transaction?.accountId ?? '',
    rootId: transaction?.categoryRootId ?? '',
    subcategoryId: isChild ? (transaction?.categoryId ?? '') : '',
    amount: transaction ? minorToInput(transaction.amountMinor) : '',
    oneoffName: transaction?.oneoffName ?? '',
    description: transaction?.description ?? '',
    comment: transaction?.comment ?? '',
  };
}

/**
 * «Зберегти і наступна»: keeps the date, account, type and category, clears the amount and the
 * texts.
 */
export function nextFinanceTransactionFormValues(
  values: FinanceTransactionFormValues,
): FinanceTransactionFormValues {
  return { ...values, amount: '', oneoffName: '', description: '', comment: '' };
}

/** Request fields; call only after validation passed. */
export function financeTransactionBody(
  values: FinanceTransactionFormValues,
): FinanceTransactionBody {
  return {
    date: values.date,
    type: values.type,
    accountId: values.accountId,
    amountMinor: parseMoneyToMinor(values.amount) ?? 0,
    categoryId: values.subcategoryId || values.rootId,
    oneoffName: values.oneoffName.trim() || null,
    description: values.description.trim() || null,
    comment: values.comment.trim() || null,
  };
}

/**
 * Categories a form may offer: active ones of the area and direction, plus the ones the operation
 * already has (they stay valid after being switched off).
 */
export function financeCategoryChoices(
  categories: readonly FinanceCategory[],
  scope: FinanceCategory['scope'],
  type: CategoryDirection,
  parentId: string | null,
  keepId: string,
): FinanceCategory[] {
  return categories
    .filter(
      (row) =>
        row.scope === scope &&
        row.direction === type &&
        row.parentId === parentId &&
        (row.active || row.id === keepId),
    )
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'uk'));
}
