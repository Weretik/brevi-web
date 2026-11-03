import type { CustomerKeepinSyncResult } from '../../entities/customers/customer-keepin-sync-result';

/** One line for the notice after «Оновити з KeepinCRM». */
export function describeCustomerKeepinSync(result: CustomerKeepinSyncResult): string {
  const summary =
    `Оновлено з KeepinCRM: отримано ${result.received}, нових ${result.created}, ` +
    `оновлено ${result.updated}, без змін ${result.unchanged}.`;
  return result.deactivated.length
    ? `${summary} Немає в KeepinCRM (позначені як не використовуються): ${result.deactivated.join(', ')}.`
    : summary;
}
