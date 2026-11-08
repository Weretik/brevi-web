import {
  useGetLeadCallResultsQuery,
  useGetLeadMyDayQuery,
  useGetLeadQuery,
  useRecordLeadCallMutation,
} from '@admin/leads/data-access';
import { emptyLeadCallForm, validateLeadCallForm } from '@admin/leads/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { LeadCallFormValues, LeadSummary } from '@admin/leads/model';

interface FormState {
  leadId: number | null;
  values: LeadCallFormValues;
  showErrors: boolean;
  error: string | null;
}

const blank = (leadId: number | null): FormState => ({
  leadId,
  values: emptyLeadCallForm,
  showErrors: false,
  error: null,
});

/** The next lead after `id` in the queue the manager saw, skipping the ones already called now. */
function nextAfter(queue: readonly LeadSummary[], id: number, called: ReadonlySet<number>) {
  const index = queue.findIndex((x) => x.id === id);
  return queue.slice(index + 1).find((x) => !called.has(x.id))?.id ?? null;
}

/**
 * «Мій день» (variant C): the queue on the left, one lead to call on the right, and the result form.
 * Saving a call moves on to the next lead of the queue.
 */
export function useMyDay(notify: (message: string) => void, focusId: number | null) {
  const day = useGetLeadMyDayQuery();
  const results = useGetLeadCallResultsQuery();
  const [selectedId, setSelectedId] = useState<number | null>(focusId);
  const [called, setCalled] = useState<ReadonlySet<number>>(new Set());
  const [form, setForm] = useState<FormState>(blank(null));
  const [record, recording] = useRecordLeadCallMutation();

  const queue = day.data?.queue ?? [];
  const currentId = selectedId ?? queue.find((x) => !called.has(x.id))?.id ?? queue[0]?.id ?? null;
  const lead = useGetLeadQuery(currentId ?? 0, { skip: currentId === null });
  const activeResults = (results.data ?? []).filter((x) => x.isActive);
  const current = form.leadId === currentId ? form : blank(currentId);
  const now = new Date();
  const errors = validateLeadCallForm(current.values, activeResults, now);

  async function submit() {
    const detail = lead.data;
    if (!detail || currentId === null || recording.isLoading) return;
    if (Object.keys(errors).length) {
      setForm({ ...current, showErrors: true });
      return;
    }
    try {
      await record({ id: detail.id, version: detail.version, values: current.values }).unwrap();
      const done = new Set(called).add(detail.id);
      setCalled(done);
      setSelectedId(nextAfter(queue, detail.id, done));
      setForm(blank(null));
      notify(`Збережено: ${detail.company}`);
    } catch (error) {
      setForm({ ...current, error: adminApiErrorMessage(error, 'Не вдалося зберегти дзвінок.') });
    }
  }

  return {
    day: day.data,
    loading: day.isLoading || results.isLoading,
    error: day.isError
      ? adminApiErrorMessage(day.error, 'Не вдалося завантажити «Мій день».')
      : results.isError
        ? adminApiErrorMessage(results.error, 'Не вдалося завантажити результати дзвінків.')
        : null,
    retry: () => {
      void day.refetch();
      void results.refetch();
    },
    currentId,
    select: setSelectedId,
    lead: lead.data && lead.data.id === currentId ? lead.data : undefined,
    leadLoading: lead.isFetching && lead.data?.id !== currentId,
    leadError: lead.isError ? adminApiErrorMessage(lead.error, 'Не вдалося відкрити лід.') : null,
    results: activeResults,
    values: current.values,
    errors,
    showErrors: current.showErrors,
    saveError: current.error,
    saving: recording.isLoading,
    now,
    change: (values: LeadCallFormValues) =>
      setForm({ leadId: currentId, values, showErrors: current.showErrors, error: null }),
    submit,
  };
}

export type MyDay = ReturnType<typeof useMyDay>;
