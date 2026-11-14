import {
  useCreateProductionOrderMutation,
  useGetProductionQuoteDraftQuery,
  useGetProductionQuoteSourcesQuery,
} from '@admin/production/data-access';
import {
  createOrderBody,
  createOrderFormValues,
  hasCreateOrderErrors,
  todayIso,
  validateCreateOrder,
} from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import { useDebouncedValue } from '../requests/use-debounced-value';
import { useRequestId } from '../requests/use-request-id';

import type {
  CreateOrderErrors,
  CreateOrderFormValues,
  CreateOrderLine,
  ProductionOrder,
  ProductionQuoteDraft,
} from '@admin/production/model';

const noErrors: CreateOrderErrors = { header: {}, lines: {} };

/**
 * «Нове завдання»: pick a КП «під запит» (or come with one from the КП editor), fill in its items, pass it to the
 * workshop once.
 */
export function useProductionOrderCreate(
  onCreated: (order: ProductionOrder) => void,
  initialQuoteId: number | null = null,
) {
  const [search, setSearch] = useState('');
  const [quoteId, setQuoteId] = useState<number | null>(initialQuoteId);
  const [form, setForm] = useState<{ quoteId: number; values: CreateOrderFormValues } | null>(null);
  const [errors, setErrors] = useState<CreateOrderErrors>(noErrors);
  const [message, setMessage] = useState<string | null>(null);
  const requestId = useRequestId();
  const sources = useGetProductionQuoteSourcesQuery(useDebouncedValue(search));
  const draft = useGetProductionQuoteDraftQuery(quoteId ?? 0, {
    skip: quoteId === null,
  });
  const [create, creation] = useCreateProductionOrderMutation();

  const loadedDraft: ProductionQuoteDraft | null =
    quoteId !== null && draft.data?.quoteId === quoteId ? draft.data : null;
  // A new КП starts a fresh form; the same one keeps what was typed.
  const values =
    loadedDraft && form?.quoteId === loadedDraft.quoteId
      ? form.values
      : loadedDraft
        ? createOrderFormValues(loadedDraft, todayIso())
        : null;

  function change(next: CreateOrderFormValues) {
    if (loadedDraft) setForm({ quoteId: loadedDraft.quoteId, values: next });
  }

  function changeLine(quoteItemId: number, line: CreateOrderLine) {
    if (!values) return;
    change({
      ...values,
      lines: values.lines.map((x) => (x.quoteItemId === quoteItemId ? line : x)),
    });
  }

  async function submit() {
    if (!loadedDraft || !values) return;
    const found = validateCreateOrder(values);
    setErrors(found);
    if (hasCreateOrderErrors(found)) return;
    setMessage(null);
    try {
      const order = await create(
        createOrderBody(loadedDraft, values, requestId.current()),
      ).unwrap();
      requestId.renew();
      onCreated(order);
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося створити завдання.'));
    }
  }

  return {
    search,
    setSearch,
    sources: sources.data ?? [],
    sourcesLoading: sources.isLoading || sources.isFetching,
    sourcesError: sources.error
      ? adminApiErrorMessage(sources.error, 'Не вдалося завантажити КП.')
      : null,
    quoteId,
    pick: (id: number | null) => {
      setQuoteId(id);
      setErrors(noErrors);
      setMessage(null);
      requestId.renew();
    },
    draft: loadedDraft,
    draftLoading: quoteId !== null && (draft.isLoading || draft.isFetching),
    draftError: draft.error ? adminApiErrorMessage(draft.error, 'Не вдалося відкрити КП.') : null,
    values,
    errors,
    message,
    saving: creation.isLoading,
    change,
    changeLine,
    submit,
  };
}
