import {
  useGetFinanceCounterpartiesQuery,
  useReviewFinanceTransactionMutation,
  useVerifyFinanceCounterpartyMutation,
} from '@admin/accounting/data-access';
import {
  canRememberCategory,
  counterpartyDefaultCategory,
  createFinanceTransactionFormValues,
  financeTransactionReviewBody,
  validateFinanceTransactionReview,
} from '@admin/accounting/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  FinanceCategory,
  FinanceTransaction,
  FinanceTransactionField,
  FinanceTransactionFieldErrors,
  FinanceTransactionFormValues,
} from '@admin/accounting/model';

/**
 * «Перевірити» one operation: its category and who it is with. An unconfirmed finance counterparty
 * can be confirmed right here, which also clears its other operations. «Запамʼятати» (on by
 * default) makes the category the default of a finance counterparty.
 */
export function useFinanceTransactionReview(
  transaction: FinanceTransaction,
  categories: readonly FinanceCategory[],
  onSaved: (message: string) => void,
) {
  const [values, setValues] = useState(() =>
    createFinanceTransactionFormValues(transaction, transaction.type, transaction.date),
  );
  const [errors, setErrors] = useState<FinanceTransactionFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [remember, setRemember] = useState(true);
  const [review, reviewState] = useReviewFinanceTransactionMutation();
  const [verify, verifyState] = useVerifyFinanceCounterpartyMutation();
  const pending =
    !values.oneoff && values.counterparty?.kind === 'Financial' && !values.counterparty.verified
      ? values.counterparty
      : null;
  // The record with its version, needed by «Підтвердити».
  const record = useGetFinanceCounterpartiesQuery(
    { tab: 'Financial', page: 1, includeArchived: true, search: pending?.name ?? '' },
    { skip: !pending },
  ).data?.financial.find((row) => row.id === pending?.id);

  function change<Field extends FinanceTransactionField>(
    field: Field,
    value: FinanceTransactionFormValues[Field],
  ) {
    setValues((current) => {
      const next = { ...current, [field]: value };
      if (field === 'rootId') return { ...next, subcategoryId: '' };
      if (field === 'counterparty' && !current.rootId) {
        const category = counterpartyDefaultCategory(
          categories,
          next.counterparty,
          transaction.scope,
          transaction.type,
        );
        if (category) return { ...next, ...category };
      }
      return next;
    });
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function confirmCounterparty() {
    if (!record || verifyState.isLoading) return;
    setMessage(null);
    try {
      await verify({ id: record.id, version: record.version }).unwrap();
      setValues((current) =>
        current.counterparty
          ? { ...current, counterparty: { ...current.counterparty, verified: true } }
          : current,
      );
      setErrors((current) => ({ ...current, counterparty: undefined }));
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося підтвердити контрагента.'));
    }
  }

  async function save() {
    if (reviewState.isLoading) return;
    const validation = validateFinanceTransactionReview(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    try {
      await review({
        id: transaction.id,
        body: financeTransactionReviewBody(values, transaction.version, remember),
      }).unwrap();
      onSaved('Операцію перевірено.');
    } catch (error) {
      if (isAdminApiError(error)) setErrors(error.fieldErrors);
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти перевірку.'));
    }
  }

  const rememberRoot = canRememberCategory(values)
    ? categories.find((row) => row.id === values.rootId)?.name
    : undefined;

  return {
    values,
    /** «Запамʼятати: наступні операції «X» одразу в «Y»», or null when it does not apply. */
    rememberLabel:
      rememberRoot && values.counterparty
        ? `Запамʼятати: наступні операції «${values.counterparty.name}» одразу в «${rememberRoot}»`
        : null,
    remember,
    setRemember,
    errors,
    message,
    saving: reviewState.isLoading,
    /** An unconfirmed finance counterparty of the form, with «Підтвердити» when found. */
    pending: pending
      ? { name: pending.name, canConfirm: Boolean(record), confirming: verifyState.isLoading }
      : null,
    change,
    save,
    confirmCounterparty: () => void confirmCounterparty(),
  };
}
