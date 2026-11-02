import type { operations } from '@admin/shared/contracts';

export type PricingParametersResponse =
  operations['getPricingParameters']['responses'][200]['content']['application/json'];
export type CreatePricingParameterBody =
  operations['createPricingParameter']['requestBody']['content']['application/json'];
export type UpdatePricingParameterBody =
  operations['updatePricingParameter']['requestBody']['content']['application/json'];

export type PpeMarkupRulesResponse =
  operations['getPpeMarkupRules']['responses'][200]['content']['application/json'];
export type CreatePpeMarkupRuleBody =
  operations['createPpeMarkupRule']['requestBody']['content']['application/json'];
export type UpdatePpeMarkupRuleBody =
  operations['updatePpeMarkupRule']['requestBody']['content']['application/json'];
