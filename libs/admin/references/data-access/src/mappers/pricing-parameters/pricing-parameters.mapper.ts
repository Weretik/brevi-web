import type {
  PpeMarkupRulesResponse,
  PricingParametersResponse,
} from '../../contracts/pricing-parameters/pricing-parameters-response';
import type { PpeMarkupRule, PricingParameter } from '@admin/references/model';

export function mapPricingParameters(value: PricingParametersResponse): PricingParameter[] {
  return value.map((row) => ({
    id: row.id,
    code: row.code,
    group: row.group,
    name: row.name,
    value: row.value ?? null,
    unit: row.unit,
    isCalculated: row.isCalculated,
    updatedOn: row.updatedOn ?? null,
    comment: row.comment ?? null,
    sortOrder: row.sortOrder,
  }));
}

export function mapPpeMarkupRules(value: PpeMarkupRulesResponse): PpeMarkupRule[] {
  return value.map((row) => ({
    id: row.id,
    name: row.name,
    retailMarkup: row.retailMarkup,
    wholesaleMarkup: row.wholesaleMarkup,
    largeWholesaleMarkup: row.largeWholesaleMarkup,
    priceNote: row.priceNote ?? null,
    appliesTo: row.appliesTo ?? null,
    sortOrder: row.sortOrder,
  }));
}
