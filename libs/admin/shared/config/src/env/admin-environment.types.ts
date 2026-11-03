export interface AdminEnvironment {
  readonly production: boolean;
  readonly enableHttpLogs?: boolean;
  readonly app?: {
    readonly name?: string;
    readonly version?: string;
  };
  readonly api?: {
    readonly baseUrl?: string;
  };
  readonly features?: {
    readonly catalog?: boolean;
    readonly dashboard?: boolean;
  };
  readonly routerBasename?: string;
}
