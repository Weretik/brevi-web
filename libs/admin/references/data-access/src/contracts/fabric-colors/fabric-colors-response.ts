import type { operations } from '@admin/shared/contracts';

export type FabricColorsResponse =
  operations['getFabricColors']['responses'][200]['content']['application/json'];
export type FabricColorBody =
  operations['createFabricColor']['requestBody']['content']['application/json'];
