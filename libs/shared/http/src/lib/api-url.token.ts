import { InjectionToken } from '@angular/core';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
export const ENABLE_HTTP_LOGS = new InjectionToken<boolean>('ENABLE_HTTP_LOGS', {
  factory: () => false,
});
