import {
  useDeleteContentArticleMutation,
  useGetContentArticleQuery,
  useSaveContentArticleMutation,
} from '@admin/content/data-access';
import {
  articleFormOf,
  articleInputOf,
  articleTitle,
  hasArticleErrors,
  newArticleForm,
  validateArticle,
} from '@admin/content/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

import type { ArticleErrors, ArticleFormValues } from '@admin/content/model';

/** Today in the browser's time zone as `YYYY-MM-DD`. */
function today(): string {
  const now = new Date();
  const two = (value: number) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${two(now.getMonth() + 1)}-${two(now.getDate())}`;
}

/**
 * Side panel of one article (`id` null = a new one). An existing one opens as a view and
 * «Редагувати» opens the form; a new one opens as the form at once. The save sends the revision the
 * user opened; a newer change by someone else comes back as an error to reopen.
 */
export function useArticleEditor(id: number | null, onDone: (text: string) => void) {
  const isNew = id === null;
  const query = useGetContentArticleQuery(id ?? skipToken);
  const article = query.currentData ?? null;
  const [values, setValues] = useState<ArticleFormValues | null>(() =>
    id === null ? newArticleForm(today()) : null,
  );
  const [errors, setErrors] = useState<ArticleErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [save, saveState] = useSaveContentArticleMutation();
  const [remove, removeState] = useDeleteContentArticleMutation();

  async function submit() {
    if (!values || saveState.isLoading || (!isNew && !article)) return;
    const found = validateArticle(values, isNew);
    setErrors(found);
    if (hasArticleErrors(found)) return;
    setMessage(null);
    try {
      const saved = await save(articleInputOf(article, values)).unwrap();
      const title = articleTitle(saved.article);
      onDone(
        isNew
          ? `Статтю «${title}» додано.${saved.article.showOnSite ? '' : ' Вона прихована, доки не ввімкнете «На сайті».'}`
          : saved.article.showOnSite
            ? `Збережено: «${title}» показується на сайті.`
            : `Збережено: «${title}».`,
      );
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти статтю.'));
    }
  }

  async function confirmDelete() {
    if (!article || removeState.isLoading) return;
    setMessage(null);
    try {
      await remove(article.article.id).unwrap();
      onDone(`Статтю «${articleTitle(article.article)}» видалено.`);
    } catch (error) {
      setConfirmingDelete(false);
      setMessage(adminApiErrorMessage(error, 'Не вдалося видалити статтю.'));
    }
  }

  return {
    isNew,
    article,
    loading: query.isLoading,
    loadError: query.error
      ? adminApiErrorMessage(query.error, 'Не вдалося завантажити статтю.')
      : null,
    mode: values ? ('edit' as const) : ('view' as const),
    enableEditing: () => {
      if (article) setValues(articleFormOf(article));
    },
    values,
    errors,
    change: (next: ArticleFormValues) => {
      setValues(next);
      if (hasArticleErrors(errors)) setErrors(validateArticle(next, isNew));
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
