import {
  useDeleteSiteCategoryMutation,
  useGetSiteCategoryQuery,
  useSaveSiteCategoryMutation,
} from '@admin/content/data-access';
import {
  hasSiteCategoryErrors,
  newSiteCategoryForm,
  siteCategoryFormOf,
  siteCategoryInputOf,
  siteCategoryName,
  validateSiteCategory,
} from '@admin/content/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

import type { SiteCategoryErrors, SiteCategoryFormValues } from '@admin/content/model';

/** What the side panel opened: a category of the tree, or a new one under `parentId` (null = top level). */
export type SiteCategoryTarget = { id: number } | { id: null; parentId: number | null };

/**
 * Side panel of one category. An existing one opens as a view and «Редагувати» opens the form; a new
 * one opens as the form at once. The save sends the revision the user opened; a newer change by
 * someone else comes back as an error to reopen.
 */
export function useSiteCategoryEditor(target: SiteCategoryTarget, onDone: (text: string) => void) {
  const isNew = target.id === null;
  const query = useGetSiteCategoryQuery(target.id ?? skipToken);
  const category = query.currentData ?? null;
  const [values, setValues] = useState<SiteCategoryFormValues | null>(() =>
    target.id === null ? newSiteCategoryForm(target.parentId) : null,
  );
  const [errors, setErrors] = useState<SiteCategoryErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [save, saveState] = useSaveSiteCategoryMutation();
  const [remove, removeState] = useDeleteSiteCategoryMutation();

  async function submit() {
    if (!values || saveState.isLoading || (!isNew && !category)) return;
    const found = validateSiteCategory(values, isNew);
    setErrors(found);
    if (hasSiteCategoryErrors(found)) return;
    setMessage(null);
    try {
      const saved = await save(siteCategoryInputOf(category, values)).unwrap();
      const name = siteCategoryName(saved.category);
      onDone(
        isNew
          ? `Розділ «${name}» додано.${saved.category.showOnSite ? '' : ' Він прихований, доки не ввімкнете «На сайті».'}`
          : saved.category.onSite
            ? `Збережено: «${name}» показується на сайті.`
            : `Збережено: «${name}».`,
      );
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти розділ.'));
    }
  }

  async function confirmDelete() {
    if (!category || removeState.isLoading) return;
    setMessage(null);
    try {
      await remove(category.category.id).unwrap();
      onDone(`Розділ «${siteCategoryName(category.category)}» видалено.`);
    } catch (error) {
      setConfirmingDelete(false);
      setMessage(adminApiErrorMessage(error, 'Не вдалося видалити розділ.'));
    }
  }

  return {
    isNew,
    category,
    loading: query.isLoading,
    loadError: query.error
      ? adminApiErrorMessage(query.error, 'Не вдалося завантажити розділ.')
      : null,
    mode: values ? ('edit' as const) : ('view' as const),
    enableEditing: () => {
      if (category) setValues(siteCategoryFormOf(category));
    },
    values,
    errors,
    change: (next: SiteCategoryFormValues) => {
      setValues(next);
      if (hasSiteCategoryErrors(errors)) setErrors(validateSiteCategory(next, isNew));
    },
    message,
    saving: saveState.isLoading,
    submit,
    confirmingDelete,
    askDelete: () => setConfirmingDelete(true),
    cancelDelete: () => setConfirmingDelete(false),
    deleting: removeState.isLoading,
    confirmDelete,
  };
}
