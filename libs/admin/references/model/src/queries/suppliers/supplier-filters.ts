import type { Supplier } from '../../entities/suppliers/supplier';

export type SupplierActivityFilter = 'active' | 'inactive' | 'all';

/** Local search over the loaded list: name, contact, phone, email, purchases and tags. */
export function filterSuppliers(
  rows: Supplier[],
  search: string,
  activity: SupplierActivityFilter,
): Supplier[] {
  const query = search.trim().toLocaleLowerCase('uk');
  return rows.filter(
    (row) =>
      (activity === 'all' || row.isActive === (activity === 'active')) &&
      (!query ||
        [
          row.name,
          row.contactPerson,
          row.phoneNumber,
          row.email,
          row.purchaseCategories,
          row.tags,
        ].some((value) => value?.toLocaleLowerCase('uk').includes(query))),
  );
}
