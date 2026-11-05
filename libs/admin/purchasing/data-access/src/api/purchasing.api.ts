import { purchaseInvoiceEndpoints } from './invoices/purchase-invoice-endpoints';
import { purchasingBaseApi } from './purchasing-base-api';

export const purchasingApi = purchasingBaseApi.injectEndpoints({
  endpoints: (build) => ({
    ...purchaseInvoiceEndpoints(build),
  }),
});

export const {
  useGetPurchaseInvoicesQuery,
  useLazyGetPurchaseDocumentTemplateQuery,
  useRecognizeNewPurchaseFilesMutation,
  useRecognizePurchaseFileMutation,
  useSavePurchaseDocumentMutation,
  useGetPurchaseSuppliersQuery,
  useGetPurchaseSyncStateQuery,
  useReviewPurchaseInvoiceMutation,
  useSyncPurchaseInvoicesMutation,
} = purchasingApi;
