import { minorToInput, parseMoneyToMinor } from '../../mappers/money/finance-money';
import { categoryPickerValues } from '../counterparties/finance-counterparty-form';

import type {
  CategoryDirection,
  FinanceCategory,
} from '../../entities/categories/finance-category';
import type {
  FinanceCounterpartyChoice,
  FinanceCounterpartyRef,
} from '../../entities/counterparties/finance-counterparty';
import type {
  FinanceTransaction,
  FinanceTransactionBody,
  FinanceTransactionReviewBody,
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
    counterparty: counterpartyChoiceOf(transaction?.counterparty ?? null),
    oneoff: Boolean(transaction?.oneoffName),
    oneoffName: transaction?.oneoffName ?? '',
    description: transaction?.description ?? '',
    comment: transaction?.comment ?? '',
  };
}

/** The saved counterparty of an operation as a choice of its picker. */
export function counterpartyChoiceOf(
  ref: FinanceCounterpartyRef | null,
): FinanceCounterpartyChoice | null {
  if (!ref) return null;
  return {
    kind: ref.kind,
    id: ref.id,
    name: ref.name,
    hint: '',
    verified: ref.verified,
    defaultCategoryId: null,
  };
}

/**
 * «Зберегти і наступна»: keeps the date, account, type and category, clears the amount and the
 * texts.
 */
export function nextFinanceTransactionFormValues(
  values: FinanceTransactionFormValues,
): FinanceTransactionFormValues {
  return {
    ...values,
    amount: '',
    counterparty: null,
    oneoff: false,
    oneoffName: '',
    description: '',
    comment: '',
  };
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
    counterparty:
      values.oneoff || !values.counterparty
        ? null
        : { kind: values.counterparty.kind, id: values.counterparty.id },
    oneoffName: values.oneoff ? values.oneoffName.trim() || null : null,
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

/**
 * «Перевірити»: only the category and who the operation is with. `remember` counts only for a
 * finance counterparty (see `canRememberCategory`).
 */
export function financeTransactionReviewBody(
  values: FinanceTransactionFormValues,
  version: number,
  remember = false,
): FinanceTransactionReviewBody {
  const { categoryId, counterparty, oneoffName } = financeTransactionBody(values);
  return {
    categoryId,
    counterparty,
    oneoffName,
    version,
    rememberCategory: remember && canRememberCategory(values),
  };
}

/** «Запамʼятати» applies to a finance counterparty picked from the list, not a one-off name. */
export const canRememberCategory = (
  values: Pick<FinanceTransactionFormValues, 'oneoff' | 'counterparty'>,
) => !values.oneoff && values.counterparty?.kind === 'Financial';

/**
 * The default category of a picked counterparty, when it fits the operation: an active category
 * of the same area and direction.
 */
export function counterpartyDefaultCategory(
  categories: readonly FinanceCategory[],
  choice: FinanceCounterpartyChoice | null,
  scope: FinanceCategory['scope'],
  type: CategoryDirection,
): { rootId: string; subcategoryId: string } | null {
  const category = categories.find((row) => row.id === choice?.defaultCategoryId);
  if (!category || !category.active || category.scope !== scope || category.direction !== type)
    return null;
  return categoryPickerValues(categories, category.id);
}
