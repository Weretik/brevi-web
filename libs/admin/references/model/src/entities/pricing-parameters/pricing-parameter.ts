/**
 * A row of «Параметри ціноутворення» (the Calculator sheet «Налаштування цін»). Percentages are
 * fractions, as in the sheet: 0.25 = 25 %. A calculated parameter's value comes from a formula.
 */
export interface PricingParameter {
  id: number;
  code: string;
  group: string;
  name: string;
  value: number | null;
  unit: string;
  isCalculated: boolean;
  updatedOn: string | null;
  comment: string | null;
  sortOrder: number;
}

/** A PPE markup rule: price = supplier price × (1 + markup); markups are fractions. */
export interface PpeMarkupRule {
  id: number;
  name: string;
  retailMarkup: number;
  wholesaleMarkup: number;
  largeWholesaleMarkup: number;
  priceNote: string | null;
  appliesTo: string | null;
  sortOrder: number;
}
