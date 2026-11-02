import type { Supplier, SupplierDraft } from '../../entities/suppliers/supplier';

export type SupplierDialogMode = 'create' | 'view' | 'edit';

export function createSupplierDraft(supplier: Supplier | null, nextId: number): SupplierDraft {
  return {
    id: supplier?.id ?? nextId,
    name: supplier?.name ?? '',
    link: supplier?.link ?? '',
    contactPerson: supplier?.contactPerson ?? '',
    phoneNumber: supplier?.phoneNumber ?? '',
    notes: supplier?.notes ?? '',
  };
}
