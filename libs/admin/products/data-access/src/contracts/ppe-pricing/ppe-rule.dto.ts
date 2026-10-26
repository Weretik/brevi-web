import type { operations } from '@admin/shared/contracts';

export type PpeRuleDto =
  operations['getPpePricingRule']['responses'][200]['content']['application/json'];
