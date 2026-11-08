import {
  useGetLeadCategoriesQuery,
  useGetLeadStatsCallResultsQuery,
  useSaveLeadCallResultMutation,
  useSaveLeadCategoryMutation,
} from '@admin/leads/data-access';
import {
  emptyLeadCallResultForm,
  leadCallResultFormFrom,
  leadCategoryDescriptionMaxLength,
  validateLeadCallResultForm,
} from '@admin/leads/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { LeadCallResult, LeadCallResultFormValues, LeadCategory } from '@admin/leads/model';

type Editing =
  | { kind: 'result'; id: number | null; values: LeadCallResultFormValues }
  | { kind: 'category'; code: string; description: string };

/** «Довідники» of leads: call results and category descriptions, each edited in the side panel. */
export function useLeadReferences(notify: (message: string) => void) {
  const results = useGetLeadStatsCallResultsQuery();
  const categories = useGetLeadCategoriesQuery();
  const [saveResult, savingResult] = useSaveLeadCallResultMutation();
  const [saveCategory, savingCategory] = useSaveLeadCategoryMutation();
  const [editing, setEditing] = useState<Editing | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allResults = results.data ?? [];
  const others =
    editing?.kind === 'result' ? allResults.filter((x) => x.id !== editing.id) : allResults;
  const resultErrors =
    editing?.kind === 'result' ? validateLeadCallResultForm(editing.values, others) : {};
  const categoryError =
    editing?.kind === 'category' &&
    editing.description.trim().length > leadCategoryDescriptionMaxLength
      ? `Опис до ${leadCategoryDescriptionMaxLength} символів.`
      : undefined;

  const start = (next: Editing) => {
    setEditing(next);
    setShowErrors(false);
    setError(null);
  };

  async function submit() {
    if (!editing) return;
    if (Object.keys(resultErrors).length || categoryError) {
      setShowErrors(true);
      return;
    }
    try {
      if (editing.kind === 'result') {
        const saved = await saveResult({ id: editing.id, values: editing.values }).unwrap();
        notify(`Результат «${saved.name}» збережено`);
      } else {
        await saveCategory({ code: editing.code, description: editing.description }).unwrap();
        notify(`Категорію ${editing.code} збережено`);
      }
      setEditing(null);
    } catch (failure) {
      setError(adminApiErrorMessage(failure, 'Не вдалося зберегти.'));
    }
  }

  return {
    results: allResults,
    categories: categories.data ?? [],
    loading: results.isLoading || categories.isLoading,
    loadError:
      results.isError || categories.isError
        ? adminApiErrorMessage(
            results.error ?? categories.error,
            'Не вдалося завантажити довідники.',
          )
        : null,
    editing,
    showErrors,
    resultErrors,
    categoryError,
    error,
    saving: savingResult.isLoading || savingCategory.isLoading,
    createResult: () =>
      start({
        kind: 'result',
        id: null,
        values: emptyLeadCallResultForm(Math.max(0, ...allResults.map((x) => x.position)) + 1),
      }),
    editResult: (result: LeadCallResult) =>
      start({ kind: 'result', id: result.id, values: leadCallResultFormFrom(result) }),
    editCategory: (category: LeadCategory) =>
      start({ kind: 'category', code: category.code, description: category.description ?? '' }),
    change: (next: Editing) => {
      setEditing(next);
      setError(null);
    },
    close: () => setEditing(null),
    submit,
  };
}

export type LeadReferences = ReturnType<typeof useLeadReferences>;
