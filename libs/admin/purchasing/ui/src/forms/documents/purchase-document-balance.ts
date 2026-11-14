import { formatPurchaseKopecks } from '@admin/purchasing/model';

import type { PurchaseDocumentCheck } from '@admin/purchasing/model';

/**
 * The line under the form: the sum of the positions (plus VAT when the prices are without it) and whether it
 * matches «До оплати», or a hint while some sum is not a number yet.
 */
export function purchaseDocumentBalanceText(
  check: Pick<PurchaseDocumentCheck, 'linesKopecks' | 'balanced'>,
  addsVat: boolean,
): string {
  if (check.linesKopecks === null) return 'Сума позицій порахується, коли всі суми будуть числами.';
  const label = addsVat ? 'Позиції + ПДВ' : 'Сума позицій';
  const verdict = check.balanced ? 'збігається з «До оплати».' : 'не збігається з «До оплати».';
  return `${label}: ${formatPurchaseKopecks(check.linesKopecks)} грн — ${verdict}`;
}
