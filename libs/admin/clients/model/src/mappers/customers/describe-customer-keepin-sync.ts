import type { CustomerKeepinSyncResult } from '../../entities/customers/customer-keepin-sync-result';
import type { CustomerSummary } from '../../entities/customers/customer-summary';

/** One line for the notice after «Оновити з KeepinCRM». */
export function describeCustomerKeepinSync(result: CustomerKeepinSyncResult): string {
  const summary =
    `Оновлено з KeepinCRM: отримано ${result.received}, нових ${result.created}, ` +
    `оновлено ${result.updated}, без змін ${result.unchanged}.`;
  return result.deactivated.length
    ? `${summary} Немає в KeepinCRM (позначені як не використовуються): ${result.deactivated.join(', ')}.`
    : summary;
}

/** Latest KeepinCRM sync time among the listed clients, for the tab subtitle. */
export function lastCustomerKeepinSync(rows: readonly CustomerSummary[]): string | null {
  return rows.reduce<string | null>(
    (latest, row) =>
      row.keepinSyncedAt && (!latest || Date.parse(row.keepinSyncedAt) > Date.parse(latest))
        ? row.keepinSyncedAt
        : latest,
    null,
  );
}
