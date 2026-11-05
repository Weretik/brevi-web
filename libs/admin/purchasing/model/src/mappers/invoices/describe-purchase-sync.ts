import type { PurchaseSyncResult } from '../../entities/invoices/purchase-sync';

const plural = (count: number, one: string, few: string, many: string) => {
  const last = count % 10;
  const lastTwo = count % 100;
  if (last === 1 && lastTwo !== 11) return one;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return few;
  return many;
};

/** Short Ukrainian notice after «Оновити зараз». */
export function describePurchaseSync(result: PurchaseSyncResult): string {
  const changes = [
    result.messagesAdded > 0 && `нових повідомлень: ${result.messagesAdded}`,
    result.messagesUpdated > 0 && `змінених: ${result.messagesUpdated}`,
    result.rowsDeactivated > 0 && `зникли з таблиці рядків: ${result.rowsDeactivated}`,
  ].filter(Boolean);
  const total = `${result.recordCount} ${plural(result.recordCount, 'рядок', 'рядки', 'рядків')} у таблиці`;
  return changes.length > 0
    ? `Реєстр оновлено: ${changes.join(', ')}. Усього ${total}.`
    : `Реєстр оновлено, змін немає. Усього ${total}.`;
}
