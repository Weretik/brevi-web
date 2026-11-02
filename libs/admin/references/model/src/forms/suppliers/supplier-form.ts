import type { Supplier, SupplierDraft } from '../../entities/suppliers/supplier';

export type SupplierDialogMode = 'create' | 'view' | 'edit';

/** Card fields owned by KeepinCRM for a linked supplier; Brevi edits only activity and notes. */
export const keepinCrmOwnedSupplierFields = [
  'name',
  'purchaseCategories',
  'link',
  'contactPerson',
  'phoneNumber',
  'email',
] as const satisfies readonly (keyof SupplierDraft)[];

export function isKeepinCrmSupplier(supplier: Supplier | null): boolean {
  return Boolean(supplier?.keepinCrmId);
}

export function createSupplierDraft(supplier: Supplier | null, nextId: number): SupplierDraft {
  return {
    id: supplier?.id ?? nextId,
    name: supplier?.name ?? '',
    link: supplier?.link ?? '',
    contactPerson: supplier?.contactPerson ?? '',
    phoneNumber: supplier?.phoneNumber ?? '',
    email: supplier?.email ?? '',
    purchaseCategories: supplier?.purchaseCategories ?? '',
    isActive: supplier?.isActive ?? true,
    notes: supplier?.notes ?? '',
  };
}
