import { apiCall, apiClient } from '@admin/shared/api-client';

import { purchaseInvoicesTag } from '../../cache/purchase-invoice-tags';
import { purchaseApiError } from '../../errors/purchase-api-error';
import {
  mapPurchaseDocumentSave,
  mapPurchaseRecognition,
  mapPurchaseRecognitionBatch,
} from '../../mappers/purchase-document.mapper';

import type { PurchasingEndpointBuilder } from '../base/purchasing-endpoint-builder';
import type {
  PurchaseDocumentSave,
  PurchaseDocumentUpload,
  PurchaseRecognition,
  PurchaseRecognitionBatch,
} from '@admin/purchasing/model';

export function purchaseDocumentEndpoints(build: PurchasingEndpointBuilder) {
  return {
    recognizePurchaseFile: build.mutation<PurchaseRecognition, string>({
      queryFn: (fileId, { signal }) =>
        apiCall(
          apiClient.POST('/api/purchasing/invoices/files/{fileId}/recognize', {
            params: { path: { fileId: fileId } },
            signal,
          }),
          mapPurchaseRecognition,
          purchaseApiError,
        ),
      invalidatesTags: (_, error) => (error ? [] : [purchaseInvoicesTag]),
    }),
    /** One batch; the feature repeats it. The list reloads after every batch that read a file. */
    recognizeNewPurchaseFiles: build.mutation<PurchaseRecognitionBatch, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.POST('/api/purchasing/invoices/recognize-new', { signal }),
          mapPurchaseRecognitionBatch,
          purchaseApiError,
        ),
      invalidatesTags: (result) =>
        result && result.recognized + result.needsReview + result.failed + result.skipped > 0
          ? [purchaseInvoicesTag]
          : [],
    }),
    savePurchaseDocument: build.mutation<PurchaseDocumentSave, PurchaseDocumentUpload>({
      queryFn: ({ fileId, document, replace }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/purchasing/invoices/files/{fileId}/document', {
            params: { path: { fileId: fileId } },
            body: { document, replace },
            signal,
          }),
          mapPurchaseDocumentSave,
          purchaseApiError,
        ),
      invalidatesTags: (_, error) => (error ? [] : [purchaseInvoicesTag]),
    }),
    /** The JSON as the server gives it, to be saved as a file and edited by hand. */
    getPurchaseDocumentTemplate: build.query<unknown, string>({
      queryFn: (fileId, { signal }) =>
        apiCall(
          apiClient.GET('/api/purchasing/invoices/files/{fileId}/document-template', {
            params: { path: { fileId: fileId } },
            signal,
          }),
          undefined,
          purchaseApiError,
        ),
      keepUnusedDataFor: 0,
    }),
  };
}
