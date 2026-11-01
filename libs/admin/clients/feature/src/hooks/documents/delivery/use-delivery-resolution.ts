import { useResolveQuoteDeliveryMutation } from '@admin/clients/data-access';
import { deliveryResolutionErrors, emptyDeliveryResolutionDraft } from '@admin/clients/model';
import { isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import { useDeliveryAttemptRefresh } from './use-delivery-attempt-refresh';

import type { useDocumentAction } from '../use-document-action';
import type { DeliveryResolutionDraft, QuoteDeliveryView } from '@admin/clients/model';

export function useDeliveryResolution(
  quoteId: string,
  disabled: boolean,
  action: ReturnType<typeof useDocumentAction>,
  onResolved: (row: QuoteDeliveryView) => void,
) {
  const [target, setTarget] = useState<QuoteDeliveryView | null>(null);
  const [draft, setDraft] = useState<DeliveryResolutionDraft>(emptyDeliveryResolutionDraft);
  const [conflict, setConflict] = useState(false);
  const [writeError, setWriteError] = useState('');
  const [resolve] = useResolveQuoteDeliveryMutation();
  const refreshAttempt = useDeliveryAttemptRefresh(quoteId, action, (row) => {
    setTarget(row);
    setConflict(false);
    setWriteError('');
  });
  const locked =
    disabled || action.pending || action.uncertain || action.forbidden || refreshAttempt.pending;
  const errors = deliveryResolutionErrors(draft);
  const canConfirm =
    !!target?.canResolveManually && !locked && !conflict && Object.keys(errors).length === 0;
  const reset = () => {
    refreshAttempt.reset();
    setTarget(null);
    setDraft(emptyDeliveryResolutionDraft);
    setConflict(false);
    setWriteError('');
  };
  const open = (row: QuoteDeliveryView) => {
    if (locked || !row.canResolveManually || row.quoteId !== quoteId) return;
    reset();
    setTarget(row);
  };
  const confirm = () => {
    if (!canConfirm || !target || draft.outcome === '') return;
    const intent = {
      quoteId,
      deliveryId: target.id,
      requestId: crypto.randomUUID(),
      expectedAttempt: target.attempt,
      outcome: draft.outcome,
      evidenceNote: draft.evidenceNote.trim(),
    };
    setWriteError('');
    void action.execute(async () => {
      try {
        const row = await resolve(intent).unwrap();
        if (!action.isCurrent()) return;
        if (!row) throw new Error('Немає підтвердженого результату перевірки.');
        onResolved(row);
        reset();
      } catch (error) {
        if (action.isCurrent())
          setWriteError(
            isAdminApiError(error)
              ? error.message
              : 'Результат запису невідомий. Повторіть той самий запит.',
          );
        if (action.isCurrent() && isAdminApiError(error) && error.status === 409) setConflict(true);
        throw error;
      }
    });
  };
  const refresh = () => {
    if (!locked && target) refreshAttempt.run(target);
  };
  return {
    target,
    draft,
    errors,
    locked,
    canConfirm,
    reset,
    open,
    confirm,
    refresh,
    error: refreshAttempt.error || writeError,
    change: (value: DeliveryResolutionDraft) => {
      if (!locked) setDraft(value);
    },
    close: () => {
      if (!locked) reset();
    },
  };
}
