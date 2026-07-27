export interface CreateGarmentPartOperationRequest {
  id: number;
  garmentPartName: string;
  name: string;
  min: number;
}

export interface UpdateGarmentPartOperationRequest {
  garmentPartName: string;
  name: string;
  min: number;
}
