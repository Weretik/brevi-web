import {
  useEnqueueQuoteDeliveryMutation,
  useGetActiveQuoteEmailTemplateQuery,
  useGetQuoteDeliveriesQuery,
} from '@admin/clients/data-access';
import { useState } from 'react';

import { useDocumentAction } from '../use-document-action';

import type {
  QuoteDetail,
  QuotePdfView,
  QuoteDeliveryView,
  EmailTemplateView,
} from '@admin/clients/model';

export function useQuoteDelivery(
  detail: QuoteDetail,
  pdf: QuotePdfView | null,
  disabled: boolean,
  onLock: (pending: boolean, uncertain: boolean) => void,
) {
  const [page, setPage] = useState(1);
  const [recipient, setRecipient] = useState('');
  const [manager, setManager] = useState('');
  const [capturedTemplate, setCapturedTemplate] = useState<EmailTemplateView | null>(null);
  const [accepted, setAccepted] = useState<QuoteDeliveryView | null>(null);
  const action = useDocumentAction(onLock, () => {
    setAccepted(null);
    setCapturedTemplate(null);
    setRecipient('');
    setManager('');
  });
  const template = useGetActiveQuoteEmailTemplateQuery(undefined, { skip: action.forbidden });
  const history = useGetQuoteDeliveriesQuery(
    { quoteId: detail.publicId, page },
    { skip: action.forbidden, pollingInterval: 10000, skipPollingIfUnfocused: true },
  );
  const [enqueue] = useEnqueueQuoteDeliveryMutation();
  const fieldsLocked = disabled || action.pending || action.uncertain || action.forbidden;
  const canSend =
    !fieldsLocked &&
    !detail.archived &&
    detail.canEdit &&
    (detail.state === 'ready' || detail.state === 'sent') &&
    pdf?.status === 'succeeded' &&
    !!template.currentData &&
    !template.isError &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient) &&
    recipient.length <= 254 &&
    !!manager.trim() &&
    manager.length <= 200 &&
    !/[\r\n\0]/.test(manager);
  const send = () => {
    if (!canSend || !pdf || !template.currentData) return;
    setCapturedTemplate(template.currentData);
    const intent = {
      quoteId: detail.publicId,
      versionId: detail.versionId,
      revision: detail.revision,
      requestId: crypto.randomUUID(),
      pdfId: pdf.artifactId,
      templateId: template.currentData.id,
      recipient: recipient.trim(),
      manager: manager.trim(),
    };
    void action.execute(async () => {
      const result = await enqueue(intent).unwrap();
      if (!action.isCurrent()) return;
      if (!result) throw new Error('Немає підтвердженого результату запиту.');
      setAccepted(result);
      void history.refetch();
    });
  };
  return {
    template,
    displayTemplate: action.pending || action.uncertain ? capturedTemplate : template.currentData,
    history,
    page,
    setPage,
    recipient,
    setRecipient,
    manager,
    setManager,
    accepted,
    action,
    fieldsLocked,
    canSend,
    send,
  };
}
