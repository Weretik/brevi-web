/** «: 2 без категорії, 1 з новим контрагентом» — only the reasons that are there. */
export function financeReviewReasons(withoutCategory: number, newCounterparty: number): string {
  const parts = [
    withoutCategory ? `${withoutCategory} без категорії` : '',
    newCounterparty ? `${newCounterparty} з новим контрагентом` : '',
  ].filter(Boolean);
  return parts.length ? `: ${parts.join(', ')}` : '';
}
