import { InjectionToken } from '@angular/core';

export interface AppConfig {
  production: boolean;
  appName: string;
  appVersion: string;
  apiBaseUrl: string;
  features: {
    admin: boolean;
    storefront: boolean;
  };
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
