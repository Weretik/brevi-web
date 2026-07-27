export interface CreateGarmentAccessoryRequest {
  id: number;
  name: string;
  price: number | null;
  supplierName: string;
}

export interface UpdateGarmentAccessoryRequest {
  name: string;
  price: number | null;
  supplierName: string;
}
