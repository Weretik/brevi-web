/** Ukrainian forms of a counted word: one, few (2–4), many. */
export type FinanceCountForms = readonly [one: string, few: string, many: string];

export const financeOperationForms: FinanceCountForms = ['операція', 'операції', 'операцій'];
export const financeCategoryForms: FinanceCountForms = ['категорія', 'категорії', 'категорій'];

/** «1 операція», «3 операції», «12 операцій». */
export function formatFinanceCount(count: number, [one, few, many]: FinanceCountForms): string {
  const tail = count % 10;
  const teen = count % 100 >= 11 && count % 100 <= 14;
  const word = teen ? many : tail === 1 ? one : tail >= 2 && tail <= 4 ? few : many;
  return `${count} ${word}`;
}
