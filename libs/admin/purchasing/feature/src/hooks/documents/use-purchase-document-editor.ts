import {
  useGetPurchaseDocumentTemplateQuery,
  useSavePurchaseDocumentMutation,
} from '@admin/purchasing/data-access';
import {
  checkPurchaseDocument,
  purchaseDocumentFormOf,
  purchaseDocumentJsonOf,
} from '@admin/purchasing/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useEffect, useMemo, useState } from 'react';

import type { PurchaseDocumentFormValues, PurchaseDocumentIdentity } from '@admin/purchasing/model';

/**
 * «Виправити»: loads the facts (saved, else the last AI answer) and saves them back. The user's
 * edit replaces the earlier facts; the server keeps those in history.
 */
export function usePurchaseDocumentEditor(fileId: string, onSaved: (message: string) => void) {
  const template = useGetPurchaseDocumentTemplateQuery(fileId, { refetchOnMountOrArgChange: true });
  const [save, saving] = useSavePurchaseDocumentMutation();
  const [values, setValues] = useState<PurchaseDocumentFormValues | null>(null);
  const [identity, setIdentity] = useState<PurchaseDocumentIdentity | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (template.data === undefined || values) return;
    const form = purchaseDocumentFormOf(template.data);
    setValues(form.values);
    setIdentity(form.identity);
  }, [template.data, values]);

  const check = useMemo(() => (values ? checkPurchaseDocument(values) : null), [values]);

  async function submit() {
    if (!values || !identity || !check || saving.isLoading) return;
    setShowErrors(true);
    setMessage(null);
    if (!check.valid) {
      setMessage(
        check.balanced
          ? 'Виправте позначені поля.'
          : 'Сума позицій не збігається з «До оплати». Перевірте суми з оригіналом.',
      );
      return;
    }
    try {
      const saved = await save({
        fileId,
        document: purchaseDocumentJsonOf(values, identity),
        replace: true,
      }).unwrap();
      onSaved(saved.unchanged ? 'Дані не змінилися.' : 'Дані рахунку збережено.');
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти дані рахунку.'));
    }
  }

  return {
    loading: template.isFetching && !values,
    loadError: template.error
      ? adminApiErrorMessage(template.error, 'Не вдалося відкрити дані рахунку.')
      : null,
    values,
    check,
    showErrors,
    message,
    saving: saving.isLoading,
    change: setValues,
    submit,
  };
}
