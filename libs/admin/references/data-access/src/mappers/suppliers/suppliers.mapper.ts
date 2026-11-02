import type { SuppliersResponse } from '../../contracts/suppliers/suppliers-response';
import type { Supplier } from '@admin/references/model';

export function mapSuppliers(value: SuppliersResponse): Supplier[] {
  return value.map((row) => ({
    id: row.id,
    name: row.name,
    link: row.link,
    contactPerson: row.contactPerson,
    phoneNumber: row.phoneNumber,
    notes: row.notes,
  }));
}
