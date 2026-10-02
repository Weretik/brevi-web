import { createAppConfig } from './app-config';

import type { AppConfig } from './app-config.types';
import type { AdminEnvironment } from '../env/admin-environment.types';

export let appConfig: AppConfig = createAppConfig({ production: false });

export function configureAppConfig(environment: AdminEnvironment): void {
  appConfig = createAppConfig(environment);
}
