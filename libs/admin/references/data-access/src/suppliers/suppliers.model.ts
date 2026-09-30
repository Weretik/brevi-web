export interface Supplier {
  id: number;
  name: string;
  link: string | null;
  contactPerson: string | null;
  phoneNumber: string | null;
  notes: string | null;
}

export interface SupplierDraft {
  id: number;
  name: string;
  link: string;
  contactPerson: string;
  phoneNumber: string;
  notes: string;
}
