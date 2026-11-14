import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import { referenceErrorMessages } from '../../errors/reference-error-messages';
import { mapSuppliers } from '../../mappers/suppliers/suppliers.mapper';
import { parseSupplierKeepinSyncResponse } from '../../validators/suppliers/supplier-keepin-sync-response';
import { parseSuppliersResponse } from '../../validators/suppliers/suppliers-response';

import type { SupplierDraft, SupplierKeepinSyncResult } from '@admin/references/model';
import type { operations } from '@admin/shared/contracts';

type CreateSupplierBody =
  operations['createSupplier']['requestBody']['content']['application/json'];
type UpdateSupplierBody =
  operations['updateSupplier']['requestBody']['content']['application/json'];
type UpdateSupplierBreviFieldsBody =
  operations['updateSupplierBreviFields']['requestBody']['content']['application/json'];

const keepinSyncErrorMessages = {
  ...referenceErrorMessages,
  fallback: 'KeepinCRM недоступний або не налаштований. Дані в Brevi не змінено.',
};

function optional(value: string): string | null {
  return value.trim() || null;
}

function supplierBody(draft: SupplierDraft): UpdateSupplierBody {
  return {
    name: draft.name.trim(),
    link: optional(draft.link),
    contactPerson: optional(draft.contactPerson),
    phoneNumber: optional(draft.phoneNumber),
    notes: optional(draft.notes),
    email: optional(draft.email),
    purchaseCategories: optional(draft.purchaseCategories),
    isActive: draft.isActive,
  };
}

export const suppliersApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listSuppliers: build.query<ReturnType<typeof mapSuppliers>, void>({
      query: () => '/api/reference/suppliers',
      transformResponse: (value: unknown) => mapSuppliers(parseSuppliersResponse(value)),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      providesTags: (result) => [
        { type: 'Supplier', id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: 'Supplier' as const, id })) ?? []),
      ],
    }),
    createSupplier: build.mutation<void, SupplierDraft>({
      query: (draft) => ({
        url: '/api/reference/suppliers',
        method: 'POST',
        body: { id: draft.id, ...supplierBody(draft) } satisfies CreateSupplierBody,
      }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Supplier', id: 'LIST' }]),
    }),
    updateSupplier: build.mutation<void, SupplierDraft>({
      query: (draft) => ({
        url: `/api/reference/suppliers/${draft.id}`,
        method: 'PUT',
        body: supplierBody(draft),
      }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error, { id }) =>
        error
          ? []
          : [
              { type: 'Supplier', id },
              { type: 'Supplier', id: 'LIST' },
            ],
    }),
    /** Activity and notes: the only fields Brevi edits for a KeepinCRM supplier. */
    updateSupplierBreviFields: build.mutation<void, SupplierDraft>({
      query: (draft) => ({
        url: `/api/reference/suppliers/${draft.id}/brevi-fields`,
        method: 'PUT',
        body: {
          isActive: draft.isActive,
          notes: optional(draft.notes),
        } satisfies UpdateSupplierBreviFieldsBody,
      }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error, { id }) =>
        error
          ? []
          : [
              { type: 'Supplier', id },
              { type: 'Supplier', id: 'LIST' },
            ],
    }),
    syncSuppliersFromKeepinCrm: build.mutation<SupplierKeepinSyncResult, void>({
      query: () => ({ url: '/api/reference/suppliers/keepin-sync', method: 'POST' }),
      transformResponse: (value: unknown) => parseSupplierKeepinSyncResponse(value),
      transformErrorResponse: (error) => toAdminApiError(error, keepinSyncErrorMessages),
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Supplier', id: 'LIST' }]),
    }),
    deleteSupplier: build.mutation<void, number>({
      query: (id) => ({ url: `/api/reference/suppliers/${id}`, method: 'DELETE' }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error, id) =>
        error
          ? []
          : [
              { type: 'Supplier', id },
              { type: 'Supplier', id: 'LIST' },
            ],
    }),
  }),
});

export const {
  useCreateSupplierMutation,
  useDeleteSupplierMutation,
  useListSuppliersQuery,
  useSyncSuppliersFromKeepinCrmMutation,
  useUpdateSupplierBreviFieldsMutation,
  useUpdateSupplierMutation,
} = suppliersApi;
