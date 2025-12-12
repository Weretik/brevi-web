import { environment } from '@environments/environment';

export const AppConfig = {
  production: environment.production,
  appName: environment.app.name,
  appVersion: environment.app.version,
  apiBaseUrl: environment.api.baseUrl,
  features: environment.features,
} as const;
