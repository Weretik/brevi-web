import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { authInterceptor, provideSessionTokenAuth, unauthorizedInterceptor } from '@shared/auth';
import { provideApiAndLogging, provideGlobalErrorHandling } from '@shared/config';
import { baseUrlInterceptor, errorInterceptor, loggingInterceptor } from '@shared/http';
import { BreviStorePreset } from '@shared/theme';
import { createPrimeNgConfig } from '@shared/ui';
import { providePrimeNG } from 'primeng/config';

import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    ...provideApiAndLogging(environment),
    provideHttpClient(
      withInterceptors([
        baseUrlInterceptor,
        authInterceptor,
        unauthorizedInterceptor,
        loggingInterceptor,
        errorInterceptor,
      ]),
    ),
    providePrimeNG(createPrimeNgConfig(BreviStorePreset)),
    ...provideSessionTokenAuth(),
    ...provideGlobalErrorHandling(),
  ],
};
