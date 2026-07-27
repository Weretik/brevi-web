export interface CreateFabricRequest {
  id: number;
  name: string;
  price: number | null;
  providerName: string;
}

export interface UpdateFabricRequest {
  name: string;
  price: number | null;
  providerName: string;
}
