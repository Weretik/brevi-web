export interface CreateAdditionalReferenceRequest {
  id: number;
  name: string;
  key: string;
  value: number;
  unit: string;
  description: string | null;
}

export interface UpdateAdditionalReferenceRequest {
  name: string;
  key: string;
  value: number;
  unit: string;
  description: string | null;
}
