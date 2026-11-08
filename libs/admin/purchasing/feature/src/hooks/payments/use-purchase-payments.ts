import {
  useGetPurchasePaymentCandidatesQuery,
  useLinkPurchasePaymentMutation,
  useUnlinkPurchasePaymentMutation,
} from '@admin/purchasing/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';

import type {
  PurchaseInvoice,
  PurchaseInvoicePayment,
  PurchaseInvoicePayments,
  PurchasePaymentCandidate,
} from '@admin/purchasing/model';

const searchDelayMs = 300;

/**
 * «Оплата» of an invoice card: link and unlink expenses of «Бухгалтерія». The last answer is used
 * until the reloaded list catches up, so the next change sends the new review version.
 */
export function usePurchasePayments(invoice: PurchaseInvoice) {
  const [last, setLast] = useState<PurchaseInvoicePayments | null>(null);
  const [picking, setPicking] = useState(false);
  const [search, setSearch] = useState('');
  const [applied, setApplied] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [link, linkState] = useLinkPurchasePaymentMutation();
  const [unlink, unlinkState] = useUnlinkPurchasePaymentMutation();
  const candidates = useGetPurchasePaymentCandidatesQuery(
    picking ? { messageId: invoice.messageId, search: applied } : skipToken,
  );

  useEffect(() => {
    const timer = setTimeout(() => setApplied(search), searchDelayMs);
    return () => clearTimeout(timer);
  }, [search]);

  const current =
    last && last.reviewVersion > invoice.reviewVersion
      ? last
      : {
          reviewVersion: invoice.reviewVersion,
          totalPayableMinor: invoice.totalPayableMinor,
          payments: invoice.payments,
          paymentIssues: invoice.paymentIssues,
        };
  const busy = linkState.isLoading || unlinkState.isLoading;

  async function change(
    run: typeof link,
    transactionId: string,
    failure: string,
  ): Promise<boolean> {
    setMessage(null);
    try {
      setLast(
        await run({
          messageId: invoice.messageId,
          transactionId,
          version: current.reviewVersion,
        }).unwrap(),
      );
      return true;
    } catch (error) {
      setMessage(adminApiErrorMessage(error, failure));
      return false;
    }
  }

  return {
    ...current,
    busy,
    message,
    picking,
    search,
    candidates: candidates.data ?? [],
    candidatesLoading: candidates.isFetching,
    candidatesError: candidates.error
      ? adminApiErrorMessage(candidates.error, 'Не вдалося завантажити витрати.')
      : null,
    startPicking: () => setPicking(true),
    stopPicking: () => {
      setPicking(false);
      setSearch('');
      setApplied('');
    },
    setSearch,
    link: async (candidate: PurchasePaymentCandidate) => {
      if (await change(link, candidate.transactionId, 'Не вдалося привʼязати оплату.'))
        setPicking(false);
    },
    unlink: (payment: PurchaseInvoicePayment) =>
      void change(unlink, payment.transactionId, 'Не вдалося відвʼязати оплату.'),
  };
}
