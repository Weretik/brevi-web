import type { operations } from '@admin/shared/contracts';

export type SupplierKeepinSyncResponse =
  operations['syncSuppliersFromKeepinCrm']['responses'][200]['content']['application/json'];
