import { createAppConfig } from './app-config';

import type { AppConfig } from './app-config-contract';
import type { AdminEnvironment } from '../env/admin-environment-contract';

export let appConfig: AppConfig = createAppConfig({ production: false });

export function configureAppConfig(environment: AdminEnvironment): void {
  appConfig = createAppConfig(environment);
}
