import { ApplicationConfig, provideBrowserGlobalErrorListeners, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { BreviStorePreset } from '@shared/ui';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TokenProvider, SessionTokenProvider } from '@shared/auth';
import { baseUrlInterceptor, errorInterceptor, loggingInterceptor } from '@shared/http';
import { authInterceptor, unauthorizedInterceptor } from '@shared/auth';
import { GlobalErrorHandler } from '@shared/util';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        baseUrlInterceptor,
        authInterceptor,
        unauthorizedInterceptor,
        loggingInterceptor,
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
