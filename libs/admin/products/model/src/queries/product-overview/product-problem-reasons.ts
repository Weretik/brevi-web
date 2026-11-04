import { ppeBlockerReasons } from '../ppe-card/ppe-blocker-reasons';
import { sewingBlockerReasons } from '../sewing-card/sewing-blocker-reasons';

import type { ProductOverviewType } from '../../entities/product-overview/product-overview';

const listReasons: Record<string, string> = {
  NoActiveArticle: 'Немає активної тканини',
  Unpublished: 'Ціну ще не опубліковано',
};

/** Short reasons a «Товари» row or fabric variant has no price (CAT-013); empty when it has one. */
export function productProblemReasons(
  type: ProductOverviewType,
  codes: readonly string[],
): string[] {
  const known = codes.filter((code) => listReasons[code]).map((code) => listReasons[code]);
  const rest = codes.filter((code) => !listReasons[code]);
  const mapped =
    type === 'Ppe' ? ppeBlockerReasons(rest) : sewingBlockerReasons(rest.map((code) => ({ code })));
  return [...new Set([...known, ...mapped])];
}
