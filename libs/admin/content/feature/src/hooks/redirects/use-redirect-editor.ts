import {
  useDeleteSiteRedirectMutation,
  useSaveSiteRedirectMutation,
} from '@admin/content/data-access';
import { redirectPath, validateRedirect } from '@admin/content/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { RedirectErrors, RedirectFormValues, SiteRedirect } from '@admin/content/model';

const blank: RedirectFormValues = { fromPath: '', toPath: '', note: '' };

/** The side panel of one redirect: a new one opens as a form, an existing one as a read view. */
export function useRedirectEditor(redirect: SiteRedirect | null, onDone: (text: string) => void) {
  const [values, setValues] = useState<RedirectFormValues | null>(redirect ? null : blank);
  const [errors, setErrors] = useState<RedirectErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [save, saving] = useSaveSiteRedirectMutation();
  const [remove, deleting] = useDeleteSiteRedirectMutation();

  async function submit() {
    if (!values) return;
    const found = validateRedirect(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setMessage(null);
    try {
      const saved = await save({
        id: redirect?.id ?? null,
        fromPath: values.fromPath.trim(),
        toPath: values.toPath.trim(),
        note: values.note.trim() || null,
      }).unwrap();
      onDone(`Переадресацію ${saved.fromPath} → ${saved.toPath} збережено.`);
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти переадресацію.'));
    }
  }

  async function confirmDelete() {
    if (!redirect) return;
    try {
      await remove(redirect.id).unwrap();
      setConfirmingDelete(false);
      onDone(`Переадресацію ${redirect.fromPath} видалено.`);
    } catch (error) {
      setConfirmingDelete(false);
      setMessage(adminApiErrorMessage(error, 'Не вдалося видалити переадресацію.'));
    }
  }

  return {
    isNew: redirect === null,
    values,
    errors,
    message,
    saving: saving.isLoading,
    deleting: deleting.isLoading,
    confirmingDelete,
    /** The normalized addresses the server will keep, shown under the form. */
    preview: values
      ? { from: redirectPath(values.fromPath), to: redirectPath(values.toPath) }
      : null,
    change: setValues,
    enableEditing: () =>
      redirect &&
      setValues({
        fromPath: redirect.fromPath,
        toPath: redirect.toPath,
        note: redirect.note ?? '',
      }),
    submit,
    askDelete: () => setConfirmingDelete(true),
    cancelDelete: () => setConfirmingDelete(false),
    confirmDelete,
  };
}
