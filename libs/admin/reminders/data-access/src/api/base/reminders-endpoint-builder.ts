import type { remindersBaseApi } from './reminders-base-api';

export type RemindersEndpointBuilder = Parameters<
  Parameters<typeof remindersBaseApi.injectEndpoints>[0]['endpoints']
>[0];
