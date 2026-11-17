import { purchasingBaseApi } from './purchasing-base-api';
import { purchaseDocumentEndpoints } from '../invoices/purchase-document-endpoints';
import { purchaseInvoiceEndpoints } from '../invoices/purchase-invoice-endpoints';

export const purchasingApi = purchasingBaseApi.injectEndpoints({
  endpoints: (build) => ({
    ...purchaseInvoiceEndpoints(build),
    ...purchaseDocumentEndpoints(build),
  }),
});

export const {
  useGetPurchaseInvoicesQuery,
  useGetPurchaseDocumentTemplateQuery,
  useGetPurchasePaymentCandidatesQuery,
  useLinkPurchasePaymentMutation,
  useUnlinkPurchasePaymentMutation,
  useStartNewPurchaseFilesRecognitionMutation,
  useRecognizePurchaseFileMutation,
  useSavePurchaseDocumentMutation,
  useGetPurchaseSuppliersQuery,
  useGetPurchaseSyncStateQuery,
  useReviewPurchaseInvoiceMutation,
  useSyncPurchaseInvoicesMutation,
} = purchasingApi;
