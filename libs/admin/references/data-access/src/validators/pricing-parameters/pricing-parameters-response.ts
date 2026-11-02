import type {
  PpeMarkupRulesResponse,
  PricingParametersResponse,
} from '../../contracts/pricing-parameters/pricing-parameters-response';

type Row = Record<string, unknown>;

const isId = (value: unknown) => Number.isInteger(value) && (value as number) > 0;
const isNumber = (value: unknown) => typeof value === 'number' && Number.isFinite(value);
const isNullableText = (value: unknown) => value === null || typeof value === 'string';

function rows(value: unknown, message: string): Row[] {
  if (!Array.isArray(value)) throw new Error(message);
  return value.map((item) => {
    if (!item || typeof item !== 'object') throw new Error(message);
    return item as Row;
  });
}

export function parsePricingParametersResponse(value: unknown): PricingParametersResponse {
  for (const row of rows(value, 'Некоректна відповідь списку параметрів.')) {
    if (
      !isId(row['id']) ||
      typeof row['code'] !== 'string' ||
      typeof row['group'] !== 'string' ||
      typeof row['name'] !== 'string' ||
      !(row['value'] === null || isNumber(row['value'])) ||
      typeof row['unit'] !== 'string' ||
      typeof row['isCalculated'] !== 'boolean' ||
      !isNullableText(row['updatedOn']) ||
      !isNullableText(row['comment']) ||
      !Number.isInteger(row['sortOrder'])
    )
      throw new Error('Некоректний запис параметра.');
  }
  return value as PricingParametersResponse;
}

export function parsePpeMarkupRulesResponse(value: unknown): PpeMarkupRulesResponse {
  for (const row of rows(value, 'Некоректна відповідь списку націнок ЗІЗ.')) {
    if (
      !isId(row['id']) ||
      typeof row['name'] !== 'string' ||
      !isNumber(row['retailMarkup']) ||
      !isNumber(row['wholesaleMarkup']) ||
      !isNumber(row['largeWholesaleMarkup']) ||
      !isNullableText(row['priceNote']) ||
      !isNullableText(row['appliesTo']) ||
      !Number.isInteger(row['sortOrder'])
    )
      throw new Error('Некоректний запис націнки ЗІЗ.');
  }
  return value as PpeMarkupRulesResponse;
}
