import type { AppConfig } from './app-config.types';
import type { AdminEnvironment } from '../env/admin-environment.types';

const trimTrailingSlash = (value: string): string => value.replace(/\/$/, '');

export function createAppConfig(environment: AdminEnvironment): AppConfig {
  return {
    apiBaseUrl: environment.production ? trimTrailingSlash(environment.api?.baseUrl ?? '') : '',
    enableHttpLogs: environment.enableHttpLogs ?? false,
    features: {
      catalog: environment.features?.catalog ?? true,
      dashboard: environment.features?.dashboard ?? true,
    },
    isDevelopment: !environment.production,
    name: environment.app?.name?.trim() || 'Brevi Admin',
    routerBasename: environment.routerBasename?.trim() || '/',
    version: environment.app?.version?.trim() || '0.1.0',
  };
}
