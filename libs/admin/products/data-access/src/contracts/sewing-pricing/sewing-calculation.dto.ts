import type { operations } from '@admin/shared/contracts';

export type SewingCalculationDto =
  operations['getSewingCalculation']['responses'][200]['content']['application/json'];
