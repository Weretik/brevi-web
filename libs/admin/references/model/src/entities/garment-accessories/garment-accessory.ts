export const garmentAccessoryUnits = ['шт.', 'м', 'послуга'] as const;

export type GarmentAccessoryUnit = (typeof garmentAccessoryUnits)[number];

export const defaultGarmentAccessoryUnit: GarmentAccessoryUnit = 'шт.';

export function isGarmentAccessoryUnit(value: unknown): value is GarmentAccessoryUnit {
  return (garmentAccessoryUnits as readonly unknown[]).includes(value);
}

export interface GarmentAccessory {
  id: number;
  /** Calculator sheet ID (FUR-001…); unique when set. Older accessories may have none. */
  code: string | null;
  name: string;
  supplierName: string;
  price: number;
  unit: GarmentAccessoryUnit;
  /** ISO date of the last price change. */
  priceUpdatedAt: string | null;
  isActive: boolean;
  comment: string | null;
}
