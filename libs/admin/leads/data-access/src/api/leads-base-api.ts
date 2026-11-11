import { adminApi } from '@admin/shared/api-client';

/**
 * `LeadList` covers «Мій день», «Усі ліди» and the statistics; one lead is `Lead`; the call results and
 * categories of «Довідники» are `LeadReference`. A call also changes «Мої завдання» (`ManagerTaskList`).
 * «Заявки з сайту» (LEAD-002) are `SiteRequestList`.
 */
export const leadsBaseApi = adminApi.enhanceEndpoints({
  addTagTypes: ['Lead', 'LeadList', 'LeadReference', 'ManagerTaskList', 'SiteRequestList'],
});
