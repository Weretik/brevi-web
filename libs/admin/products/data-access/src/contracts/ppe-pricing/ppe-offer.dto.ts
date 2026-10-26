import type { operations } from '@admin/shared/contracts';

export type PpeOfferDto =
  operations['createPpeOfferVersion']['responses'][200]['content']['application/json'];
