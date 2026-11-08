import { counterpartyChoiceOf } from '../transactions/finance-transaction-form';

import type {
  BankStatementLine,
  BankStatementLineBody,
} from '../../entities/statements/bank-statement';
import type { FinanceTransactionFormValues } from '../../validators/transactions/finance-transaction-validation';

/** The choice of one statement line: the operation fields that change plus «Проводити». */
export type BankLineFormValues = Pick<
  FinanceTransactionFormValues,
  'rootId' | 'subcategoryId' | 'counterparty' | 'oneoff' | 'oneoffName' | 'description' | 'comment'
> & {
  /** «Проводити» is the opposite: an excluded line stays out of the books. */
  excluded: boolean;
};

export type BankLineField = keyof BankLineFormValues;
export type BankLineFieldErrors = Partial<Record<BankLineField, string>>;

export function createBankLineFormValues(line: BankStatementLine): BankLineFormValues {
  const isChild = Boolean(line.subcategoryName);
  return {
    rootId: line.categoryRootId ?? '',
    subcategoryId: isChild ? (line.categoryId ?? '') : '',
    counterparty: counterpartyChoiceOf(line.counterparty),
    oneoff: Boolean(line.oneoffName),
    oneoffName: line.oneoffName,
    description: line.description,
    comment: line.comment,
    excluded: line.excluded,
  };
}

/** A line the director cannot book: an error or a record the books already have. */
export const bankLineLocked = (line: Pick<BankStatementLine, 'error' | 'duplicate'>) =>
  line.error.length > 0 || line.duplicate === 'Exact';

/** «Разова назва» on needs the name; the category may stay empty (the operation then waits for review). */
export function validateBankLine(values: BankLineFormValues): BankLineFieldErrors {
  return values.oneoff && !values.oneoffName.trim()
    ? { oneoffName: 'Вкажіть назву або вимкніть «Разова назва».' }
    : {};
}

/** Request fields; a transfer between own accounts keeps only the note and «Проводити». */
export function bankLineBody(
  values: BankLineFormValues,
  line: Pick<BankStatementLine, 'transferAccountId'>,
): BankStatementLineBody {
  const comment = values.comment.trim() || null;
  if (line.transferAccountId)
    return {
      categoryId: null,
      counterparty: null,
      oneoffName: null,
      description: null,
      comment,
      excluded: values.excluded,
    };
  return {
    categoryId: values.subcategoryId || values.rootId || null,
    counterparty:
      values.oneoff || !values.counterparty
        ? null
        : { kind: values.counterparty.kind, id: values.counterparty.id },
    oneoffName: values.oneoff ? values.oneoffName.trim() || null : null,
    description: values.description.trim() || null,
    comment,
    excluded: values.excluded,
  };
}
