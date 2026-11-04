import { adminApi } from '@admin/shared/api-client';

/** `ManagerTaskList` covers the list, the board and the overview; one task is `ManagerTask`. */
export const tasksBaseApi = adminApi.enhanceEndpoints({
  addTagTypes: ['ManagerTask', 'ManagerTaskList'],
});
