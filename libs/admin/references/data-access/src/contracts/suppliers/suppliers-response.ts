import type { operations } from '@admin/shared/contracts';

export type SuppliersResponse =
  operations['getSuppliers']['responses'][200]['content']['application/json'];
