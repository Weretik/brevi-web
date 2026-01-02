import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  authInterceptor,
  SessionTokenProvider,
  TokenProvider,
  unauthorizedInterceptor,
} from '@shared/auth';
import { API_URL, baseUrlInterceptor, errorInterceptor, loggingInterceptor } from '@shared/http';
import { BreviStorePreset, GlobalErrorHandler } from '@shared/ui';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    { provide: API_URL, useValue: environment.api.baseUrl },
    provideHttpClient(
      withInterceptors([
        baseUrlInterceptor,
        authInterceptor,
        unauthorizedInterceptor,
        loggingInterceptor,
        errorInterceptor,
      ]),
    ),
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

    { provide: TokenProvider, useClass: SessionTokenProvider },
    MessageService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
