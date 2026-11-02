import type { Supplier, SupplierKeepinSyncResult } from '../../entities/suppliers/supplier';

/** Ukrainian summary of a KeepinCRM refresh for the page notice. */
export function describeSupplierKeepinSync(result: SupplierKeepinSyncResult): string {
  const summary =
    `Оновлено з KeepinCRM: отримано ${result.received}, нових ${result.created}, ` +
    `пов'язано ${result.linked}, оновлено ${result.updated}.`;
  return result.missingInKeepinCrm.length
    ? `${summary} Немає в KeepinCRM (залишені в Brevi): ${result.missingInKeepinCrm.join(', ')}.`
    : summary;
}

/** Latest KeepinCRM refresh among the loaded suppliers, or null when none came from KeepinCRM. */
export function lastSupplierKeepinSync(rows: Supplier[]): string | null {
  return rows.reduce<string | null>(
    (latest, row) =>
      row.keepinSyncedAt && (!latest || Date.parse(row.keepinSyncedAt) > Date.parse(latest))
        ? row.keepinSyncedAt
        : latest,
    null,
  );
}
