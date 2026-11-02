import type { operations } from '@admin/shared/contracts';

export type FabricsResponse =
  operations['getFabrics']['responses'][200]['content']['application/json'];

export type CreateFabricBody =
  operations['createFabric']['requestBody']['content']['application/json'];

export type UpdateFabricBody =
  operations['updateFabric']['requestBody']['content']['application/json'];
