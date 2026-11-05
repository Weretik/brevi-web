import { useGetAccountingSettingsQuery } from '@admin/accounting/data-access';
import { defaultCutoverDate } from '@admin/accounting/model';

/** Cutover date and today in Kyiv; sensible values until the backend answers. */
export function useAccountingSettings() {
  const { data } = useGetAccountingSettingsQuery();
  return {
    cutoverDate: data?.cutoverDate ?? defaultCutoverDate,
    today: data?.today ?? new Date().toISOString().slice(0, 10),
  };
}
