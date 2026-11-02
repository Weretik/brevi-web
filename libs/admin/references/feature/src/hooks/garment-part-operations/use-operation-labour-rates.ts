import { useGetOperationLabourRatesQuery } from '@admin/references/data-access';

/** Sewing settings for the cost columns; the list still works when they cannot be read. */
export function useOperationLabourRates() {
  const result = useGetOperationLabourRatesQuery();
  return { rates: result.data ?? null, unavailable: Boolean(result.error) };
}
