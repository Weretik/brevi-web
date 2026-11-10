import { adminApi } from '@admin/shared/api-client';

export const productionBaseApi = adminApi.enhanceEndpoints({
  addTagTypes: [
    'WorkshopEmployee',
    'FabricNorm',
    'ProductionOrder',
    'WorkshopSettings',
    'FabricStock',
    'ItemFabric',
    'ProductionWork',
    'SewingForecast',
    'Timesheet',
    'Payroll',
    'WorkshopArchive',
  ],
});
