import { apiCall, apiClient } from '@admin/shared/api-client';

import {
  purchaseInvoicesTag,
  purchaseSuppliersTag,
  purchaseSyncStateTag,
} from '../../cache/purchase-invoice-tags';
import { purchaseApiError } from '../../errors/purchase-api-error';
import { mapPurchaseInvoicePage } from '../../mappers/purchase-invoice.mapper';
import {
  mapPurchaseInvoicePayments,
  mapPurchasePaymentCandidates,
} from '../../mappers/purchase-payment.mapper';
import {
  mapPurchaseInvoiceReview,
  mapPurchaseSupplierOptions,
} from '../../mappers/purchase-review.mapper';
import { mapPurchaseSyncResult, mapPurchaseSyncState } from '../../mappers/purchase-sync.mapper';

import type { PurchasingEndpointBuilder } from '../base/purchasing-endpoint-builder';
import type {
  PurchaseInvoicePage,
  PurchaseInvoicePayments,
  PurchaseInvoiceQuery,
  PurchasePaymentCandidate,
  PurchasePaymentInput,
  PurchaseInvoiceReview,
  PurchaseReviewInput,
  PurchaseSupplierOption,
  PurchaseSyncResult,
  PurchaseSyncState,
} from '@admin/purchasing/model';

export function purchaseInvoiceEndpoints(build: PurchasingEndpointBuilder) {
  return {
    getPurchaseInvoices: build.query<PurchaseInvoicePage, PurchaseInvoiceQuery>({
      queryFn: (
        { page, pageSize, search, filter, supplierId, documentFrom, documentTo, vat },
        { signal },
      ) =>
        apiCall(
          apiClient.GET('/api/purchasing/invoices', {
            params: {
              query: {
                page,
                pageSize,
                search: search || undefined,
                filter: filter === 'All' ? undefined : filter,
                supplierId,
                documentFrom: documentFrom || undefined,
                documentTo: documentTo || undefined,
                vat,
              },
            },
            signal,
          }),
          mapPurchaseInvoicePage,
          purchaseApiError,
        ),
      providesTags: [purchaseInvoicesTag],
    }),
    getPurchaseSyncState: build.query<PurchaseSyncState, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/purchasing/invoices/sync-state', { signal }),
          mapPurchaseSyncState,
          purchaseApiError,
        ),
      providesTags: [purchaseSyncStateTag],
    }),
    syncPurchaseInvoices: build.mutation<PurchaseSyncResult, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.POST('/api/purchasing/invoices/sync', { signal }),
          mapPurchaseSyncResult,
          purchaseApiError,
        ),
      // A failed sync records its reason, so the state is refreshed either way.
      invalidatesTags: (_, error) =>
        error ? [purchaseSyncStateTag] : [purchaseInvoicesTag, purchaseSyncStateTag],
    }),
    getPurchaseSuppliers: build.query<PurchaseSupplierOption[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/purchasing/invoices/suppliers', { signal }),
          mapPurchaseSupplierOptions,
          purchaseApiError,
        ),
      providesTags: [purchaseSuppliersTag],
    }),
    reviewPurchaseInvoice: build.mutation<PurchaseInvoiceReview, PurchaseReviewInput>({
      queryFn: ({ messageId, ...body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/purchasing/invoices/{messageId}/review', {
            params: { path: { messageId: messageId } },
            body: body,
            signal,
          }),
          mapPurchaseInvoiceReview,
          purchaseApiError,
        ),
      // A stale version means someone else saved: reload the list either way.
      invalidatesTags: [purchaseInvoicesTag],
    }),
    /** «Прив'язати оплату»: expenses of «Бухгалтерія» for one invoice (at most 20). */
    getPurchasePaymentCandidates: build.query<
      PurchasePaymentCandidate[],
      { messageId: string; search: string }
    >({
      queryFn: ({ messageId, search }, { signal }) =>
        apiCall(
          apiClient.GET('/api/purchasing/invoices/{messageId}/payments/candidates', {
            params: {
              path: { messageId: messageId },
              query: search.trim() ? { search: search.trim() } : undefined,
            },
            signal,
          }),
          mapPurchasePaymentCandidates,
          purchaseApiError,
        ),
      providesTags: [purchaseInvoicesTag],
    }),
    linkPurchasePayment: build.mutation<PurchaseInvoicePayments, PurchasePaymentInput>({
      queryFn: ({ messageId, ...body }, { signal }) =>
        apiCall(
          apiClient.POST('/api/purchasing/invoices/{messageId}/payments', {
            params: { path: { messageId: messageId } },
            body: body,
            signal,
          }),
          mapPurchaseInvoicePayments,
          purchaseApiError,
        ),
      // A stale version means someone else saved: reload the list either way.
      invalidatesTags: [purchaseInvoicesTag],
    }),
    unlinkPurchasePayment: build.mutation<PurchaseInvoicePayments, PurchasePaymentInput>({
      queryFn: ({ messageId, ...body }, { signal }) =>
        apiCall(
          apiClient.POST('/api/purchasing/invoices/{messageId}/payments/unlink', {
            params: { path: { messageId: messageId } },
            body: body,
            signal,
          }),
          mapPurchaseInvoicePayments,
          purchaseApiError,
        ),
      invalidatesTags: [purchaseInvoicesTag],
    }),
  };
}
