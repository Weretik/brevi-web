import { purchasingBaseApi } from './purchasing-base-api';
import { purchaseInvoiceEndpoints } from '../invoices/purchase-invoice-endpoints';

export const purchasingApi = purchasingBaseApi.injectEndpoints({
  endpoints: (build) => ({
    ...purchaseInvoiceEndpoints(build),
  }),
});

export const {
  useGetPurchaseInvoicesQuery,
  useGetPurchaseDocumentTemplateQuery,
  useGetPurchasePaymentCandidatesQuery,
  useLinkPurchasePaymentMutation,
  useUnlinkPurchasePaymentMutation,
  useRecognizeNewPurchaseFilesMutation,
  useRecognizePurchaseFileMutation,
  useSavePurchaseDocumentMutation,
  useGetPurchaseSuppliersQuery,
  useGetPurchaseSyncStateQuery,
  useReviewPurchaseInvoiceMutation,
  useSyncPurchaseInvoicesMutation,
} = purchasingApi;
