import type { operations } from '@admin/shared/contracts';

export type GarmentAccessoriesResponse =
  operations['getGarmentAccessories']['responses'][200]['content']['application/json'];

export type CreateGarmentAccessoryBody =
  operations['createGarmentAccessory']['requestBody']['content']['application/json'];

export type UpdateGarmentAccessoryBody =
  operations['updateGarmentAccessory']['requestBody']['content']['application/json'];
