export interface CreateSupplierRequest {
  id: number;
  name: string;
  link: string | null;
  contactPerson: string | null;
  phoneNumber: string | null;
  notes: string | null;
}

export interface UpdateSupplierRequest {
  name: string;
  link: string | null;
  contactPerson: string | null;
  phoneNumber: string | null;
  notes: string | null;
}
