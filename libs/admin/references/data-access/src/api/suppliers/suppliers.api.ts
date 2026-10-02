import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import { mapSuppliers } from '../../mappers/suppliers/suppliers.mapper';
import { referenceErrorMessages } from '../shared/reference-api.shared';

import type { SupplierDraft } from '@admin/references/model';
import type { operations } from '@admin/shared/contracts';

type CreateSupplierBody =
  operations['createSupplier']['requestBody']['content']['application/json'];
type UpdateSupplierBody =
  operations['updateSupplier']['requestBody']['content']['application/json'];

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
  };
}

export const suppliersApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listSuppliers: build.query<ReturnType<typeof mapSuppliers>, void>({
      query: () => '/api/reference/suppliers',
      transformResponse: mapSuppliers,
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
  useUpdateSupplierMutation,
} = suppliersApi;
