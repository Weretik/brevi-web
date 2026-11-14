import { adminApi } from '@admin/shared/api-client';

export const productionBaseApi = adminApi.enhanceEndpoints({
  addTagTypes: [
    'WorkshopEmployee',
    'FabricNorm',
    'ProductionOrder',
    'WorkshopSettings',
    'FabricStock',
    'FabricMovement',
    'ItemFabric',
    'ProductionWork',
    'SewingForecast',
    'Timesheet',
    'Payroll',
    'WorkshopArchive',
  ],
});
