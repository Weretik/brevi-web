import { InjectionToken } from '@angular/core';

export type AppLoggingConfig = {
  enabled: boolean;
  endpoint: string | null;
  environment: 'development' | 'production';
  appName: string;
  appVersion: string;
  sampleRate: number;
};

export const APP_LOGGING_CONFIG = new InjectionToken<AppLoggingConfig>('APP_LOGGING_CONFIG', {
  factory: () => ({
    enabled: false,
    endpoint: null,
    environment: 'development',
    appName: 'app',
    appVersion: '0.0.0',
    sampleRate: 1,
  }),
});
