import type { operations } from '@admin/shared/contracts';

export type GarmentPartOperationsResponse =
  operations['getGarmentPartOperations']['responses'][200]['content']['application/json'];

export type CreateGarmentPartOperationBody =
  operations['createGarmentPartOperation']['requestBody']['content']['application/json'];

export type UpdateGarmentPartOperationBody =
  operations['updateGarmentPartOperation']['requestBody']['content']['application/json'];

/** Current sewing pricing settings; the operations list needs only the labour rates. */
export type SewingSettingsResponse =
  operations['getSewingSettings']['responses'][200]['content']['application/json'];
