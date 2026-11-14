interface WorkLogOrder {
  orderId: number;
  orderNumber: number;
  clientName: string;
}

/** «Завдання» filter of «Журнал робіт»: orders found in the month's log and the open orders, once each, by label. */
export function workLogOrderOptions(
  rows: readonly WorkLogOrder[],
  openItems: readonly WorkLogOrder[],
): { id: number; label: string }[] {
  const byId = new Map<number, { id: number; label: string }>();
  for (const row of [...rows, ...openItems])
    byId.set(row.orderId, { id: row.orderId, label: `№ ${row.orderNumber} · ${row.clientName}` });
  return [...byId.values()].sort((a, b) => a.label.localeCompare(b.label, 'uk'));
}
