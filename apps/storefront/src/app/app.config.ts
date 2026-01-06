import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, ErrorHandler } from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { baseUrlInterceptor, errorInterceptor, loggingInterceptor, API_URL } from '@shared/http';
import { BreviStorePreset } from '@shared/theme';
import { GlobalErrorHandler } from '@shared/ui';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_URL, useValue: environment.api.baseUrl },
    provideHttpClient(withInterceptors([baseUrlInterceptor, loggingInterceptor, errorInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    MessageService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    providePrimeNG({
      theme: {
        preset: BreviStorePreset,
        options: {
          prefix: 'p',
          darkModeSelector: '.my-app-dark',
          cssLayer: false,
        },
      },
      ripple: true,
      inputVariant: 'filled',
      zIndex: {
        modal: 1100,
        overlay: 1000,
        menu: 1000,
        tooltip: 1100,
      },
    }),
  ],
};
