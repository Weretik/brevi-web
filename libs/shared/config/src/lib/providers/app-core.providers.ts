import { ErrorHandler, Provider } from '@angular/core';
import { API_BASE_URL, ENABLE_HTTP_LOGS } from '@shared/http';
import { APP_LOGGING_CONFIG } from '@shared/logging';
import { GlobalErrorHandler } from '@shared/ui';
import { MessageService } from 'primeng/api';

type AppEnvironmentLike = {
  production: boolean;
  enableHttpLogs: boolean;
  app: {
    name: string;
    version: string;
  };
  api: {
    baseUrl: string;
  };
  logging: {
    enabled: boolean;
    endpoint: string | null;
    sampleRate: number;
  };
};

export function provideApiAndLogging(environment: AppEnvironmentLike): Provider[] {
  return [
    { provide: API_BASE_URL, useValue: environment.api.baseUrl },
    { provide: ENABLE_HTTP_LOGS, useValue: environment.enableHttpLogs },
    {
      provide: APP_LOGGING_CONFIG,
      useValue: {
        enabled: environment.logging.enabled,
        endpoint: environment.logging.endpoint,
        environment: environment.production ? 'production' : 'development',
        appName: environment.app.name,
        appVersion: environment.app.version,
        sampleRate: environment.logging.sampleRate,
      },
    },
  ];
}

export function provideGlobalErrorHandling(): Provider[] {
  return [MessageService, { provide: ErrorHandler, useClass: GlobalErrorHandler }];
}
