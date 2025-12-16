import { ApplicationConfig, provideBrowserGlobalErrorListeners, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import BreviStorePreset from '@shared/theme/brevi-store.preset';

import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TokenProvider, SessionTokenProvider } from '@app/core/auth/';
import { baseUrlInterceptor, authInterceptor, errorInterceptor } from '@app/core/interceptors/';
import { GlobalErrorHandler } from '@app/core/errors';
import { unauthorizedInterceptor } from '@core/api/unauthorized.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        baseUrlInterceptor,
        authInterceptor,
        unauthorizedInterceptor,
        errorInterceptor,
      ]),
    ),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    providePrimeNG({
      theme: {
        preset: BreviStorePreset,
        options: {
          prefix: 'p',
          darkModeSelector: '.dark-mode',
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
