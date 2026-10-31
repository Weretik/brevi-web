export interface AppConfig {
  readonly anonymousAccess: boolean;
  readonly apiBaseUrl: string;
  readonly enableHttpLogs: boolean;
  readonly features: {
    readonly catalog: boolean;
    readonly dashboard: boolean;
  };
  readonly isDevelopment: boolean;
  readonly name: string;
  readonly routerBasename: string;
  readonly version: string;
}
