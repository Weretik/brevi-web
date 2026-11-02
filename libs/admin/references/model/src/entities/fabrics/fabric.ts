export interface Fabric {
  id: number;
  /** Calculator sheet ID (FAB-001…); unique when set. Older fabrics may have none. */
  code: string | null;
  name: string;
  nameRu: string | null;
  providerName: string;
  composition: string | null;
  compositionRu: string | null;
  /** Density, g/m². */
  density: string | null;
  /** Price per metre, UAH. */
  price: number;
  /** ISO date of the last price change. */
  priceUpdatedAt: string | null;
  /** «Активна». Inactive fabrics stay for history. */
  isActive: boolean;
  comment: string | null;
  /** Short description for commercial proposals (КП). */
  proposalDescription: string | null;
}
