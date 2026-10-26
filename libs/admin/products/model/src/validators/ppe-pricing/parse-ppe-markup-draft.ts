import type { PpeMarkups } from '../../entities/ppe-pricing/ppe-markups';
import type { PpeRuleMarkupDraft } from '../../forms/ppe-pricing/ppe-rule-markup-draft';

export function parsePpeMarkupDraft(value: PpeRuleMarkupDraft): PpeMarkups | null {
  const fields = [value.retail, value.wholesale, value.largeWholesale];
  if (
    fields.some(
      (x) =>
        !x.trim() ||
        !Number.isFinite(Number(x)) ||
        Number(x) < 0 ||
        Number(x) >= 1e12 ||
        Number(Number(x).toFixed(8)) !== Number(x),
    )
  )
    return null;
  return {
    retail: Number(value.retail),
    wholesale: Number(value.wholesale),
    largeWholesale: Number(value.largeWholesale),
  };
}
